//
//  STPrepareSyncService.m
//  StorjMobile
//
//  Created by Bogdan Artemenko on 6/4/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STPrepareSyncService.h"
#import "STFileManager.h"
#import "STStorjBackgroundServices.h"
#import "SyncQueueRepository.h"
#import "STBucketRepository.h"
#import "STFileRepository.h"
#import "STAssetFileModel.h"

@implementation STPrepareSyncService

static SyncQueueRepository *syncRepository;
static STBucketRepository *bucketRepository;
static STFileRepository *fileRepository;

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

-(STBucketRepository *) bucketRepository
{
  if(!bucketRepository)
  {
    bucketRepository = [[STBucketRepository alloc] init];
  }
  
  return bucketRepository;
}

-(STFileRepository *) fileRepository
{
  if(!fileRepository)
  {
    fileRepository = [[STFileRepository alloc] init];
  }
  return fileRepository;
}

-(NSArray *) prepareSyncQueue
{
  STFileManager *stFileManager = [[STFileManager alloc] init];
  NSArray<STAssetFileModel *> *assetsArray = [stFileManager getAssetsFromGallery];
  if(!assetsArray)
  {
    NSLog(@"Asset array is nill");
    return nil;
  }
  BucketDbo *picturesBucketDbo = [[self bucketRepository] getBucketByBucketName:@"Pictures"];
  if(!picturesBucketDbo)
  {
    NSLog(@"PicturesBucket DBO is nill");
    return nil;
  }
  NSArray *pictureFilesArray = [[self fileRepository] getAllFromBucket:[picturesBucketDbo getId]];
  if(!pictureFilesArray)
  {
    return nil;
  }
  
  for (STAssetFileModel *assetObject in assetsArray) {
    NSString *fileName = [assetObject fileName];
    BOOL isFileExistAtBucket = NO;
    for (FileDbo *picturesFile in pictureFilesArray) {
      if([[picturesFile _name] isEqualToString:fileName])
      {
        isFileExistAtBucket = YES;
        continue;
      }
    }
    if(!isFileExistAtBucket)
    {
      NSString *syncFilePath = [[stFileManager getUploadFolder]
                                stringByAppendingPathComponent: fileName];
      
      STSyncQueueEntryModel *syncEntryModel = [[self syncRepository] getByLocalPath:syncFilePath
                                                         bucketId:picturesBucketDbo._id];

      if(!syncEntryModel)
      {
        SyncQueueEntryDbo *dbo = [[SyncQueueEntryDbo alloc] init];
        dbo.fileName = fileName;
        dbo.localPath = syncFilePath;
        dbo.bucketId = picturesBucketDbo._id;
        dbo.localIdentifier = assetObject.localIdentifier;

        STSyncQueueEntryModel *syncModel = [[STSyncQueueEntryModel alloc] initWithDbo:dbo];
        [[self syncRepository] insertWithModel: syncModel];
      }
    }
  }
  
  return [[self syncRepository] getAll];
}

-(NSArray *) getSyncQueue
{
  NSArray *syncArray = [[[SyncQueueRepository alloc] init] getAll];
  
  if(!syncArray || syncArray.count == 0)
  {
    return [self prepareSyncQueue];
  }
  else
  {
    return syncArray;
  }
}


@end
