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

@import Photos;

@implementation SyncService

static SyncQueueRepository *syncRepository;
static UploadFileRepository *uploadFileRepository;

-(instancetype) init
{
  return [super init];
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

-(void) startSync
{
  NSLog(@"starting sync");
  NSArray *syncQueueArray = [[self syncRepository] getAll];
  if(!syncQueueArray || syncQueueArray.count == 0)
  {
    //error handling;
    NSLog(@"sync queue array is nil");
    return;
  }
  
  for (SyncQueueEntryDbo *syncDbo in syncQueueArray)
  {    
    NSLog(@"iterationg. now");
    if([syncDbo status] == 0) //IDLE
    {
      BOOL isCopySuccessfull = [self copyAssetToSandboxByLocalId:[syncDbo localIdentifier]
                                                   toPath:[syncDbo localPath]];
      if(isCopySuccessfull)
      {
        [[UploadService sharedInstance] syncFileWithSyncEntryId: [syncDbo _id]
                                                       bucketId: [syncDbo bucketId]
                                                       fileName: [syncDbo fileName]
                                                      localPath: [syncDbo localPath]];
      }
    }
  }
  
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
  if(!assetData){
    return NO;
  }
  BOOL isWriteSuccess = NO;
  NSFileManager *fileMan = [NSFileManager defaultManager];
  if(![fileMan fileExistsAtPath:localPath])
  {
    isWriteSuccess = [fileMan createFileAtPath:localPath contents:assetData attributes:nil];
  }
  
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
     
     NSLog(@"info:%@", info);
     NSLog(@"dataExist: %d", imageData != nil);
     dispatch_async(dispatch_get_main_queue(), ^{
       _imageData = (NSData *)[imageData copy];
       isComplete = YES;
     });
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
     dispatch_async(dispatch_get_main_queue(), ^{
       videoData = [NSData dataWithContentsOfURL:[(AVURLAsset *) asset URL]];
       isComplete = YES;
     });
    
   }];
  while (!isComplete) {
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
  if(!syncQueueArray || syncQueueArray.count == 0)
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
