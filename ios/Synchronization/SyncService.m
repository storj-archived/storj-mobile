//
//  SyncService.m
//  StorjMobile
//
//  Created by Barterio on 6/4/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "SyncService.h"
#import "SyncQueueRepository.h"
#import "UploadFileRepository.h"
#import "UploadService.h"
#import "STFileManager.h"
#import "SettingsRepository.h"
#import "Logger.h"

#import "StorjBackgroundServices.h"
#import "EventNames.h"

@import Photos;

static SyncQueueRepository *syncRepository;
static UploadFileRepository *uploadFileRepository;
static SettingsRepository *settingsRepository;

static SyncService *instance;
static dispatch_once_t onceToken;

@implementation SyncService
{
@private
  dispatch_queue_t workerQueue;
}

-(instancetype) init
{
  if(self = [super init])
  {
    workerQueue = dispatch_queue_create("io.storj.mobile.sync.queue", DISPATCH_QUEUE_SERIAL);
  }
  
  return self;
}

+(instancetype) sharedInstance
{
  dispatch_once(&onceToken, ^{
    instance = [[SyncService alloc] init];
  });
  
  return instance;
}

-(SyncQueueRepository *) syncRepository
{
  if(!syncRepository)
  {
    syncRepository = [[SyncQueueRepository alloc] init];
  }
  
  return syncRepository;
}

-(UploadFileRepository *) uploadFileRepository
{
  if(!uploadFileRepository)
  {
    uploadFileRepository = [[UploadFileRepository alloc] init];
  }
  
  return uploadFileRepository;
}

-(SettingsRepository *) settingsRepository
{
  if(!settingsRepository)
  {
    settingsRepository = [[SettingsRepository alloc] init];
  }
  
  return settingsRepository;
}

-(void) startSync
{
  dispatch_async(workerQueue, [self getSyncTask]);
}

-(void) removeFileFromSyncQueue: (int) syncEntryId
{
    dispatch_block_t removeTask = ^
    {
        SyncQueueEntryModel *model = [[self syncRepository] getById: syncEntryId];

        if(!model || [model status] != 5)
        {
          return;
        }

        [[UploadService sharedInstance] cancelSyncEntry: syncEntryId];

        SyncQueueEntryDbo *dbo = [model toDbo];
        dbo.status = 3;

        Response *resp = [[self syncRepository] updateWithModel: [[SyncQueueEntryModel alloc] initWithDbo: dbo]];

        //[resp isS]

        [[StorjBackgroundServices sharedInstance] sendEventWithName: EventNames.EVENT_SYNC_ENTRY_UPDATED
                                                               body:@{@"syncEntryId":@(syncEntryId)}];
    };
    
    dispatch_async(workerQueue, removeTask);
}

-(NSString *) currentDateFormatted
{
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  dateFormatter.locale = [NSLocale localeWithLocaleIdentifier: @"en_US_POSIX"];
  dateFormatter.dateFormat = @"yyyy-MM-dd HH:mm:ss";
  
  return [dateFormatter stringFromDate: [NSDate date]];
}

-(dispatch_block_t) getSyncTask
{
  dispatch_block_t startSyncTask = ^
  {
    NSLog(@"starting sync");
    NSArray *syncQueueArray = [[self syncRepository] getAll];
    if(!syncQueueArray || syncQueueArray.count == 0)
    {
      //error handling;
      [Logger log:@"Sync queue array is nil"];
      return;
    }
    
    
    //log to settings start time
    NSString *userEmail = [NSUserDefaults.standardUserDefaults stringForKey:@"email"];
    if(!userEmail)
    {
      [Logger log:@"No settings id! Aborting."];
      return;
    }
    [[self settingsRepository] updateById: userEmail
                                 dateTime: [self currentDateFormatted]];
    
    for (SyncQueueEntryModel *syncModel in syncQueueArray)
    {
      NSLog(@"iterationg. now");
      if([syncModel status] == 0) //IDLE
      {
        BOOL isCopySuccessfull = [self copyAssetToSandboxByLocalId:[syncModel localIdentifier]
                                                            toPath:[syncModel localPath]];
        if(isCopySuccessfull)
        {
          SyncQueueEntryDbo *dbo = [syncModel toDbo];
          dbo.status = 5;
          [[self syncRepository] updateWithModel: [[SyncQueueEntryModel alloc] initWithDbo: dbo]];
          
          [[UploadService sharedInstance] syncFileWithSyncEntryId: [syncModel _id]
                                                         bucketId: [syncModel bucketId]
                                                         fileName: [syncModel fileName]
                                                        localPath: [syncModel localPath]];
        }
      }
    }
    
    [[StorjBackgroundServices sharedInstance] sendEventWithName: EventNames.EVENT_SYNC_STARTED
                                                           body: [NSNull null]];
  };
  
  return startSyncTask;
}

-(BOOL) copyAssetToSandboxByLocalId: (NSString *) localIdentifier
                             toPath: (NSString *) localPath
{
  if(!localIdentifier)
  {
    NSLog(@"file local id malformed");
    return NO;
  }
  
  PHAsset *asset = [[PHAsset fetchAssetsWithLocalIdentifiers:@[localIdentifier] options:nil]
                    firstObject];
  NSData *assetData = [self assetDataFromPHAsset:asset];
  
  if(!assetData)
  {
    return NO;
  }
  
  BOOL isWriteSuccess = [[NSFileManager defaultManager] createFileAtPath: localPath
                                                                contents: assetData
                                                              attributes: nil];
  
  return isWriteSuccess;
}

-(NSData *) assetDataFromPHAsset: (PHAsset *) phAsset
{
  switch ([phAsset mediaType]) {
    case PHAssetMediaTypeImage:
      return [self imageDataFromPHAsset:phAsset];
      
    case PHAssetMediaTypeVideo:
      return [self videoDataFromPHAsset:phAsset];
      
    default:
      return nil;
  }
}

-(NSData *) imageDataFromPHAsset: (PHAsset *) phAsset
{
  __block NSData * _imageData;
  __block BOOL isComplete = NO;
  [[PHImageManager defaultManager] requestImageDataForAsset:phAsset
                                                    options:nil
                                              resultHandler:^(NSData * _Nullable imageData,
                                                              NSString * _Nullable dataUTI,
                                                              UIImageOrientation orientation,
                                                              NSDictionary * _Nullable info)
   {
     _imageData = (NSData *)[imageData copy];
     isComplete = YES;
   }];
  while (!isComplete) {
    [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
  }
  
  return _imageData;
}

-(NSData *) videoDataFromPHAsset: (PHAsset *) phAsset
{
  __block NSData *videoData = nil;
  __block BOOL isComplete = NO;
  [[PHCachingImageManager defaultManager] requestAVAssetForVideo:phAsset
                                   options:nil
                             resultHandler:^(AVAsset * _Nullable asset,
                                             AVAudioMix * _Nullable audioMix,
                                             NSDictionary * _Nullable info)
  {
    videoData = [NSData dataWithContentsOfURL:[(AVURLAsset *) asset URL]];
    isComplete = YES;
  }];
  
  while (!isComplete)
  {
    [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
  }
  
  return videoData;
}

-(void) stopSync
{
  //uploadFileRep getCurren upload
}

-(void) clean
{
  NSArray *syncQueueArray = [[self syncRepository] getAll];
  if(!syncQueueArray)
  {
    //error handling;
    return;
  }
  
  for (SyncQueueEntryDbo *syncDbo in syncQueueArray)
  {
    if([syncDbo status] == 1 //PROCESSING
       || [syncDbo status] == 5) //QUEUED
    {
      [syncDbo setStatus: 0]; //set to IDLE
    }
  }
}

@end
