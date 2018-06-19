//
//  STSyncService.m
//  StorjMobile
//
//  Created by Bogdan Artemenko on 6/4/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STSyncService.h"
#import "SyncQueueRepository.h"
#import "STUploadFileRepository.h"
#import "STUploadService.h"
#import "STFileManager.h"
#import "STSettingsRepository.h"
#import "Logger.h"

#import "STEventNames.h"
#import "SyncEntryState.h"
#import "StorjWrapperSingletone.h"
#import "STStorjBackgroundServices.h"

@import Photos;

static SyncQueueRepository *syncRepository;
static STUploadFileRepository *uploadFileRepository;
static STSettingsRepository *settingsRepository;

static STSyncService *instance;
static dispatch_once_t onceToken;

@implementation STSyncService
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
    instance = [[STSyncService alloc] init];
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

-(STUploadFileRepository *) uploadFileRepository
{
  if(!uploadFileRepository)
  {
    uploadFileRepository = [[STUploadFileRepository alloc] init];
  }
  
  return uploadFileRepository;
}

-(STSettingsRepository *) settingsRepository
{
  if(!settingsRepository)
  {
    settingsRepository = [[STSettingsRepository alloc] init];
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
        STSyncQueueEntryModel *model = [[self syncRepository] getById: syncEntryId];

        if(!model || [model status] != 5)
        {
          return;
        }

        [[STUploadService sharedInstance] cancelSyncEntry: syncEntryId];

        SyncQueueEntryDbo *dbo = [model toDbo];
        dbo.status = 3;

        Response *resp = [[self syncRepository] updateWithModel: [[STSyncQueueEntryModel alloc] initWithDbo: dbo]];

        //[resp isS]

        [[STStorjBackgroundServices sharedInstance] sendEventWithName: STEventNames.EVENT_SYNC_ENTRY_UPDATED
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

    NSString *userEmail = [NSUserDefaults.standardUserDefaults stringForKey:@"email"];
    if(!userEmail)
    {
      [Logger log:@"No settings id! Aborting."];
      return;
    }
    [[self settingsRepository] updateById: userEmail
                                 dateTime: [self currentDateFormatted]];
    
    for (STSyncQueueEntryModel *syncModel in syncQueueArray)
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
          [[self syncRepository] updateWithModel: [[STSyncQueueEntryModel alloc] initWithDbo: dbo]];
          
          [[STUploadService sharedInstance] syncFileWithSyncEntryId: [syncModel _id]
                                                         bucketId: [syncModel bucketId]
                                                         fileName: [syncModel fileName]
                                                        localPath: [syncModel localPath]];
        }
      }
    }
    
    [[STStorjBackgroundServices sharedInstance] sendEventWithName: STEventNames.EVENT_SYNC_STARTED
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

-(dispatch_block_t) getStopSyncTask
{
  dispatch_block_t stopSyncTask = ^
  {
    NSLog(@"starting sync");
    NSArray *syncQueueArray = [[self syncRepository] getAll];
    if(!syncQueueArray || syncQueueArray.count == 0)
    {
      //error handling;
      [Logger log:@"Sync queue array is nil"];
      return;
    }
    
    for (STSyncQueueEntryModel *syncModel in syncQueueArray)
    {
      if(syncModel.status == PROCESSING)
      {
        [[[StorjWrapperSingletone sharedStorjWrapper] storjWrapper] cancelUpload: syncModel.fileHandle];
      }
      else if (syncModel.status == QUEUED)
      {
        [self removeFileFromSyncQueue: syncModel._id];
      }
    }
  };
  
  return stopSyncTask;
}

-(void) stopSync
{
  dispatch_async(workerQueue, [self getStopSyncTask]);
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
