//
//  STStorjBackgroundServices.m
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STStorjBackgroundServices.h"
#import <CoreData/CoreData.h>

#import "STUploader.h"
#import "STDownloader.h"

#import "STFileUploadCallback.h"
#import "STFileDownloadCallback.h"

#import "STDatabaseFactory.h"

#import "STBucketRepository.h"
#import "STFileRepository.h"
#import "STUploadFileRepository.h"

#import "BucketContract.h"
#import "FileContract.h"
#import "UploadFileContract.h"
#import "SynchronizationQueueContract.h"
#import "SettingsContract.h"

#import "STFileUtils.h"
#import "DictionaryUtils.h"
#import "StorjWrapperSingletone.h"
#import "STThumbnailProcessor.h"

#import "UploadFileDbo.h"
#import "STUploadFileModel.h"
#import "STFileDeleteModel.h"

#import "STBucketModel.h"
#import "BucketDbo.h"
#import "ListResponse.h"
#import "SingleResponse.h"
#import "MethodHandler.h"

#import "STEventNames.h"

@import StorjIOS;

#import "Logger.h"

#import "STUploadService.h"
#import "STSyncService.h"
#import "SyncQueueRepository.h"
#import "STSyncScheduler.h"
#import "STFileUtils.h"

static STStorjBackgroundServices *sharedInstance = nil;

@implementation STStorjBackgroundServices

@synthesize _bucketRepository, _fileRepository, _uploadFileRepository;
@synthesize _storjWrapper;

RCT_EXPORT_MODULE(ServiceModuleIOS);

+(id)allocWithZone:(struct _NSZone *)zone {
  //static STStorjBackgroundServices *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

+(instancetype) sharedInstance
{
  return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents
{
  return [STEventNames availableEvents];
}

-(STBucketRepository *)bucketRepository{
  if(!_bucketRepository){
    _bucketRepository = [[STBucketRepository alloc] init];
  }
  return _bucketRepository;
}

-(STFileRepository *) fileRepository{
  if(!_fileRepository){
    _fileRepository = [[STFileRepository alloc] init];
  }
  return _fileRepository;
}

-(STUploadFileRepository *) uploadFileRepository{
  if(!_uploadFileRepository){
    _uploadFileRepository = [[STUploadFileRepository alloc] init];
  }
  return _uploadFileRepository;
}

-(StorjWrapper *)storjWrapper{
  if(!_storjWrapper){
    _storjWrapper = [[StorjWrapperSingletone sharedStorjWrapper]storjWrapper];
  }
  return _storjWrapper;
}

RCT_REMAP_METHOD(getBuckets,
                 getBuckets){
  [MethodHandler
   invokeBackgroundRemainWithParams:@{@KEY_TASK_NAME:@"getBuckets"}
   methodHandlerBlock:^(NSDictionary *params,
                        UIBackgroundTaskIdentifier taskId){
     SJBucketListCallback *callback = [[SJBucketListCallback alloc] init];
     callback.onSuccess = ^(NSArray<SJBucket *> * _Nullable bucketsArray) {
       NSMutableArray *buckets = [NSMutableArray arrayWithArray:bucketsArray];
       if(!buckets){
         return;
       }
       if([buckets count] == 0){
         [[self bucketRepository] deleteAll];
         [self sendEventWithName:STEventNames.EVENT_BUCKETS_UPDATED
                            body:@(YES)];
         return;
       }
       
       NSMutableArray <BucketDbo *> * bucketDbos = [NSMutableArray arrayWithArray:
                                                    [[self bucketRepository] getAll]];
       NSMutableArray <BucketDbo *> * copyBucketDbos;
       NSMutableArray <SJBucket *> *copyBuckets;
     outer:
       copyBucketDbos = [NSMutableArray arrayWithArray:bucketDbos];
       copyBuckets = [NSMutableArray arrayWithArray:buckets];
       for (SJBucket *bucketModel in copyBuckets) {
         NSString *sjBucketId = [bucketModel _id];
         for (BucketDbo* bucketDbo in copyBucketDbos) {
           NSString *dboId = [bucketDbo getId];
           if([dboId isEqualToString:sjBucketId]){
             [[self bucketRepository] updateByModel:[[STBucketModel alloc ]
                                                     initWithStorjBucketModel:bucketModel]];
             [buckets removeObject:bucketModel];
             [bucketDbos removeObject:bucketDbo];
             goto outer;
           }
         }
       }
       for (BucketDbo *dbo in bucketDbos) {
         [[self bucketRepository] deleteById:[dbo getId]];
       }
       for (SJBucket *sjModel in buckets){
         [[self bucketRepository] insertWithModel:[[STBucketModel alloc]
                                                   initWithStorjBucketModel:sjModel]];
       }
       [self sendEventWithName:STEventNames.EVENT_BUCKETS_UPDATED
                          body:@(YES)];
       NSLog(@"Sending success event for bucket updated");
       [[UIApplication sharedApplication] endBackgroundTask:taskId];
       
     };
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
       [self sendEventWithName:STEventNames.EVENT_BUCKETS_UPDATED
                          body: @(NO)];
     };
     [self.storjWrapper getBucketListWithCompletion:callback];
   } expirationHandler:^{
     
   }];
}

RCT_REMAP_METHOD(getFiles,
                 getFiles:(NSString *) bucketId){
  
  NSLog(@"Listing files for bucketId: %@", bucketId);
  [MethodHandler
   invokeBackgroundRemainWithParams:@{@KEY_TASK_NAME:@"getFiles"}
   methodHandlerBlock:^(NSDictionary *params, UIBackgroundTaskIdentifier taskId) {
     
     if(!bucketId || bucketId.length == 0){
       return;
     }
     
     SJFileListCallback *callback = [[SJFileListCallback alloc]init];
     callback.onSuccess = ^(NSArray<SJFile *> * _Nullable fileArray) {
       NSMutableArray <SJFile *> *files = [NSMutableArray arrayWithArray:fileArray];
       if(!files){
         return;
       }
       if([files count] == 0){
         [[self fileRepository] deleteAllFromBucket:bucketId];
         
         [self sendEventWithName:STEventNames.EVENT_FILES_UPDATED
                            body:[[SingleResponse successSingleResponseWithResult:bucketId]
                                  toDictionary]];
         return;
       }
       
       NSMutableArray <FileDbo *> *fileDbos = [NSMutableArray arrayWithArray:
                                               [[self fileRepository] getAllFromBucket:bucketId]];
       NSMutableArray <FileDbo *> *copyFileDbos;
       NSMutableArray <SJFile *> *copyFiles;
     outer:
       copyFileDbos = [NSMutableArray arrayWithArray:fileDbos];
       copyFiles = [NSMutableArray arrayWithArray:files];
       for (SJFile * sjFile in copyFiles) {
         NSString *sjFileId = [sjFile _fileId];
         for (FileDbo * fileDbo in copyFileDbos) {
           if([[fileDbo _fileId] isEqualToString:sjFileId]){
             [[self fileRepository] updateByModel:[[STFileModel alloc] initWithSJFile:sjFile]];
             [files removeObject:sjFile];
             [fileDbos removeObject:fileDbo];
             goto outer;
           }
         }
       }
       for (SJFile *sjFile in files) {
         [[self fileRepository] insertWithModel:[[STFileModel alloc] initWithSJFile:sjFile]];
       }
       for (FileDbo * fileDbo in fileDbos) {
         [[self fileRepository] deleteById:[fileDbo _fileId]];
       }
       
       [Logger log:@"Sending success event for files updated"];
       [self sendEventWithName:STEventNames.EVENT_FILES_UPDATED
                          body:[[SingleResponse successSingleResponseWithResult:bucketId]toDictionary]];
     };
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
       [self sendEventWithName:STEventNames.EVENT_FILES_UPDATED
                          body:@(NO)];
     };
     [[self storjWrapper] listFilesForBucketId:bucketId withCompletion:callback];
     //     [self.storjWrapper listFiles:bucketId withCompletion:(callback)];
   } expirationHandler:^{
     
   }];
}

RCT_REMAP_METHOD(createBucket,
                 createBucket:(NSString *)bucketName){
  NSLog(@"Creating bucket: %@", bucketName);
  [MethodHandler
   invokeBackgroundRemainWithParams:@{@KEY_TASK_NAME:@"createBucket"}
   methodHandlerBlock:^(NSDictionary * dictionary, UIBackgroundTaskIdentifier taskId){
     
     SJBucketCreateCallback *callback = [[SJBucketCreateCallback alloc] init];
     callback.onSuccess = ^(SJBucket * sjBucket) {
       STBucketModel *bucketModel = [[STBucketModel alloc] initWithStorjBucketModel:sjBucket];
       
       Response *insertionResponse = [_bucketRepository insertWithModel:bucketModel];
       if(insertionResponse._isSuccess){
         [self sendEventWithName: STEventNames.EVENT_BUCKET_CREATED
                            body:[[SingleResponse
                                   successSingleResponseWithResult:[DictionaryUtils
                                                                    convertToJsonWithDictionary:
                                                                    [bucketModel toDictionary]]]
                                  toDictionary]];
         
         return;
       }
       
       [self sendEventWithName:STEventNames.EVENT_BUCKET_CREATED
                          body:[[Response errorResponseWithMessage:@"Bucket insertion to db failed"]
                                toDictionary]];
     };
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
       
       [self sendEventWithName:STEventNames.EVENT_BUCKET_CREATED
                          body:[[Response errorResponseWithCode:errorCode
                                                 andWithMessage:errorMessage]
                                toDictionary]];
     };
     
     [self.storjWrapper createBucket:bucketName
                        withCallback:callback];
     
   } expirationHandler:^{
     
   }];
}

RCT_REMAP_METHOD(deleteBucket,
                 deleteBucketByBucketId:(NSString *)bucketId){
  
  [MethodHandler
   invokeBackgroundRemainWithParams:@{@KEY_TASK_NAME: @"deleteBucket"}
   methodHandlerBlock:^(NSDictionary * dictionary, UIBackgroundTaskIdentifier taskId){
     NSLog(@"Deleting bucket %@", bucketId);
     SJBucketDeleteCallback *callback = [[SJBucketDeleteCallback alloc] init];
     callback.onSuccess = ^{
       if([[[self bucketRepository] deleteById:bucketId] isSuccess]){
         [self sendEventWithName:STEventNames.EVENT_BUCKET_DELETED
                            body:[[SingleResponse successSingleResponseWithResult:bucketId]
                                  toDictionary]];
       }
     };
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
       NSLog(@"Error with deleting bucket. cause:%@", errorMessage);
       [self sendEventWithName:STEventNames.EVENT_BUCKET_DELETED
                          body:[[Response errorResponseWithMessage:@"Bucket deletion failed in db"]
                                toDictionary]];
     };
     
     [self.storjWrapper deleteBucket:bucketId withCompletion:callback];
   }expirationHandler:^{
     
   }];
}

RCT_REMAP_METHOD(deleteFile,
                 deleteFileByBucketId:(NSString *) bucketId andWithFileId: (NSString *) fileId)
{
  NSLog(@"Deleting file %@", fileId);
  [MethodHandler
   invokeBackgroundRemainWithParams:@{@KEY_TASK_NAME:@"deleteFile"}
   methodHandlerBlock:^(NSDictionary *params, UIBackgroundTaskIdentifier taskId) {
     
     SJFileDeleteCallback *callback = [[SJFileDeleteCallback alloc] init];
     callback.onSuccess = ^{
       NSLog(@"Success deletion");
       if([[self fileRepository] deleteById:fileId]){
         STFileDeleteModel *fileDeleteModel = [[STFileDeleteModel alloc] initWithBucketId:bucketId
                                                                                   fileId:fileId];
         NSString *result = [DictionaryUtils
                             convertToJsonWithDictionary:[fileDeleteModel toDictionary]];
         
         [self sendEventWithName:STEventNames.EVENT_FILE_DELETED
                            body:[[SingleResponse successSingleResponseWithResult:result]
                                  toDictionary]];
         return;
       }
       
       [self sendEventWithName:STEventNames.EVENT_FILE_DELETED
                          body:[[Response errorResponseWithMessage:@"File deletion failed in DB."]
                                toDictionary]];
     };
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
       
       NSString * result = [DictionaryUtils convertToJsonWithDictionary:
                            [[Response errorResponseWithCode:errorCode
                                              andWithMessage:errorMessage]toDictionary]];
       [self sendEventWithName:STEventNames.EVENT_FILE_DELETED
                          body:result];
     };
     [[self storjWrapper] deleteFile:fileId fromBucket:bucketId withCompletion:callback];
   }
   
   expirationHandler: ^{
     
   }];
}

RCT_REMAP_METHOD(downloadFile,
                 downloadFileWithBucketId:(NSString *) bucketId
                 fileId:(NSString *) fileId
                 localPath:(NSString *) localPath
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [Logger log: [NSString stringWithFormat:@"Downloading \nfile %@ \nfrom %@ \nto %@",
                fileId, bucketId, localPath]];
  
  STFileDownloadCallback *fileDownloadCallback = [[STFileDownloadCallback alloc] init];
  
  fileDownloadCallback._downloadStartBlock = ^(NSString *fileId,
                                               long fileHandle)
  {
    NSDictionary * eventDictionary = @{FileContract.FILE_ID: fileId,
                                       FileContract.FILE_HANDLE: @(fileHandle)};
    
    [Logger log:[NSString stringWithFormat:@"FileDownload started: %@", eventDictionary]];
    
    [self sendEventWithName:STEventNames.EVENT_FILE_DOWNLOAD_START
                       body:eventDictionary];
  };
  
  fileDownloadCallback._downloadProgressBlock = ^(NSString *fileId,
                                                  long fileHandle,
                                                  double progress)
  {
    NSDictionary *eventDictionary = @{FileContract.FILE_ID: fileId,
                                      FileContract.FILE_HANDLE: @(fileHandle),
                                      @"progress": @(progress)};
    
    [Logger log:[NSString stringWithFormat:@"FileDownloadProgress: %@", eventDictionary]];
    
    [self sendEventWithName:STEventNames.EVENT_FILE_DOWNLOAD_PROGRESS body:eventDictionary];
  };
  
  fileDownloadCallback._downloadCompleteBlock = ^(NSString *fileId,
                                                  NSString *filePath,
                                                  NSString *thumbnail)
  {
    
    NSDictionary *eventDictionary =
    @{
      FileContract.FILE_ID : [DictionaryUtils checkAndReturnNSString:fileId],
      @"localPath" : [DictionaryUtils checkAndReturnNSString:filePath],
      FileContract.FILE_THUMBNAIL : [DictionaryUtils checkAndReturnNSString:thumbnail]
      };
    
    [self sendEventWithName:STEventNames.EVENT_FILE_DOWNLOAD_SUCCESS body:eventDictionary];
    
    [Logger log:[NSString stringWithFormat:@"DownloadComplete: %@", eventDictionary]];
  };
  
  fileDownloadCallback._downloadErrorBlock = ^(NSString *fileId,
                                               int errorCode,
                                               NSString *errorMessage)
  {
    NSDictionary *eventDictionary =
    @{
      FileContract.FILE_ID : [DictionaryUtils checkAndReturnNSString:fileId],
      @"errorMessage": [DictionaryUtils checkAndReturnNSString:errorMessage],
      @"errorCode" : @(errorCode)
      };
    
    [Logger log:[NSString stringWithFormat:@"File download error event dict: %@", eventDictionary]];
    
    [self sendEventWithName:STEventNames.EVENT_FILE_DOWNLOAD_ERROR body:eventDictionary];
  };
  
  STDownloader *downloader = [[STDownloader alloc] initWithFileId:fileId
                                                         bucketId:bucketId
                                                        localPath:localPath
                                                 callbackNotifier:fileDownloadCallback];
  
  if([downloader isDownloadValid])
  {
    [downloader startDownload];
  }
}

RCT_REMAP_METHOD(startSync, startSync)
{
  [[STSyncService sharedInstance] startSync];
}

RCT_REMAP_METHOD(cancelSync, cancelSync)
{
  [[STSyncService sharedInstance] stopSync];
}

RCT_REMAP_METHOD(removeFileFromSyncQueue, removeFileFromSyncQueueWithId: (int) syncEntryId)
{
  [[STSyncService sharedInstance] removeFileFromSyncQueue: syncEntryId];
}

RCT_REMAP_METHOD(uploadFile,
                 uploadFileWithBucketId:(NSString *)bucketId
                 withLocalPath:(NSString *) localPath
                 fileName:(NSString *) fileName)
{
  [Logger log:[NSString stringWithFormat:@"Uploading file located at: %@ into bucket: %@", localPath, bucketId]];
  
  [[STUploadService sharedInstance] uploadFileWithBucketId:(NSString *) bucketId
                                                  fileName:(NSString *) fileName
                                                 localPath:(NSString *) localPath];
}

@end
