//
//  StorjBackgroundServices.m
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "StorjBackgroundServices.h"
#import <CoreData/CoreData.h>

@implementation StorjBackgroundServices
@synthesize _database;
@synthesize _bucketRepository, _fileRepository, _uploadFileRepository;
@synthesize _storjWrapper;
@synthesize _mainOperationsPromise, _uploadOperationsPromise, _downloadOperationsPromise;

RCT_EXPORT_MODULE(ServiceModuleIOS);

- (NSArray<NSString *> *)supportedEvents
{
  return [EventNames availableEvents];
}

-(FMDatabase *) database{
  if(!_database){
    _database = [[DatabaseFactory getSharedDatabaseFactory] getSharedDb];
  }
  return _database;
}

-(BucketRepository *)bucketRepository{
  if(!_bucketRepository){
    _bucketRepository = [[BucketRepository alloc] initWithDB:[self database]];
  }
  return _bucketRepository;
}

-(FileRepository *) fileRepository{
  if(!_fileRepository){
    _fileRepository = [[FileRepository alloc] initWithDB:[self database]];
  }
  return _fileRepository;
}

-(UploadFileRepository *) uploadFileRepository{
  if(!_uploadFileRepository){
    _uploadFileRepository = [[UploadFileRepository alloc] initWithDB:[self database]];
  }
  return _uploadFileRepository;
}

-(StorjWrapper *)storjWrapper{
  if(!_storjWrapper){
    _storjWrapper = [[StorjWrapperSingletone sharedStorjWrapper]storjWrapper];
  }
  return _storjWrapper;
}

RCT_REMAP_METHOD(bindGetBucketsService,
                 bindBucketsServiceWithResolver: (RCTPromiseResolveBlock) resolver
                 withRejecter: (RCTPromiseRejectBlock) rejecter){
  _mainOperationsPromise = [[PromiseHandler alloc] initWithResolver:resolver
                                                    andWithRejecter:rejecter];
}

RCT_REMAP_METHOD(bindUploadService,
                 bindUploadServiceWithResolver: (RCTPromiseResolveBlock) resolver
                 withRejecter: (RCTPromiseRejectBlock) rejecter){
  _uploadOperationsPromise = [[PromiseHandler alloc] initWithResolver:resolver
                                                    andWithRejecter:rejecter];
}

RCT_REMAP_METHOD(bindDownloadService,
                 bindDouwnloadServiceWithResolver: (RCTPromiseResolveBlock) resolver
                 withRejecter: (RCTPromiseRejectBlock) rejecter){
  _downloadOperationsPromise = [[PromiseHandler alloc] initWithResolver:resolver
                                                    andWithRejecter:rejecter];
}

RCT_REMAP_METHOD(getBuckets,
                 getBuckets){
  NSLog(@"BGService: getBuckets");
  [MethodHandler
   invokeBackgroundRemainWithParams:@{@KEY_TASK_NAME:@"getBuckets"}
   methodHandlerBlock:^(NSDictionary *params,
                        UIBackgroundTaskIdentifier taskId){
     BucketListCallback *callback = [[BucketListCallback alloc] init];
     callback.onSuccess = ^(NSArray<SJBucket *> * _Nullable bucketsArray) {
       NSMutableArray *buckets = [NSMutableArray arrayWithArray:bucketsArray];
       if(!buckets){
         return;
       }
       if([buckets count] == 0){
         [[self bucketRepository] deleteAll];
         //db close
         [self sendEventWithName:EventNames.EVENT_BUCKETS_UPDATED
                            body:@(YES)];
         return;
       }
//       [[self database] beginTransaction];
       
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
             [[self bucketRepository] updateByModel:[[BucketModel alloc ]
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
         [[self bucketRepository] insertWithModel:[[BucketModel alloc]
                                                   initWithStorjBucketModel:sjModel]];
       }
//       [[self database] commit];
       [self sendEventWithName:EventNames.EVENT_BUCKETS_UPDATED
                          body:@(YES)];
       NSLog(@"Sending success event for bucket updated");
       [[UIApplication sharedApplication] endBackgroundTask:taskId];
       
     };
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
       [self sendEventWithName:EventNames.EVENT_BUCKETS_UPDATED
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
     
     FileListCallback *callback = [[FileListCallback alloc]init];
     callback.onSuccess = ^(NSArray<SJFile *> * _Nullable fileArray) {
       NSMutableArray <SJFile *> *files = [NSMutableArray arrayWithArray:fileArray];
       if(!files){
         return;
       }
       if([files count] == 0){
         [[self fileRepository] deleteAllFromBucket:bucketId];
         //dbClose???
         [self sendEventWithName:EventNames.EVENT_FILES_UPDATED
                            body:[[SingleResponse successSingleResponseWithResult:bucketId]
                                  toDictionary]];
         return;
       }
       
       [_database beginTransaction];
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
             [[self fileRepository] updateByModel:[[FileModel alloc] initWithSJFile:sjFile]];
             [files removeObject:sjFile];
             [fileDbos removeObject:fileDbo];
             goto outer;
           }
         }
       }
       for (SJFile *sjFile in files) {
         [[self fileRepository] insertWithModel:[[FileModel alloc] initWithSJFile:sjFile]];
       }
       for (FileDbo * fileDbo in fileDbos) {
         [[self fileRepository] deleteById:[fileDbo _fileId]];
       }
       [[self database] commit];
       // close??
       NSLog(@"Sending success event for files updated");
       [self sendEventWithName:EventNames.EVENT_FILES_UPDATED
                          body:[[SingleResponse successSingleResponseWithResult:bucketId]toDictionary]];
     };
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
       [self sendEventWithName:EventNames.EVENT_FILES_UPDATED
                   body:@(NO)];
     };
     [self.storjWrapper listFiles:bucketId withCompletion:(callback)];
   } expirationHandler:^{
     
   }];
}

RCT_REMAP_METHOD(createBucket,
                 createBucket:(NSString *)bucketName){
  NSLog(@"Creating bucket: %@", bucketName);
  [MethodHandler
   invokeBackgroundRemainWithParams:@{@KEY_TASK_NAME:@"createBucket"}
   methodHandlerBlock:^(NSDictionary * dictionary, UIBackgroundTaskIdentifier taskId){
     
     BucketCreateCallback *callback = [[BucketCreateCallback alloc]init];
     callback.onSuccess = ^(SJBucket * sjBucket) {
       BucketModel *bucketModel = [[BucketModel alloc] initWithStorjBucketModel:sjBucket];
       
       Response *insertionResponse = [_bucketRepository insertWithModel:bucketModel];
       if(insertionResponse._isSuccess){
         [self sendEventWithName: EventNames.EVENT_BUCKET_CREATED
                            body:[[SingleResponse
                                  successSingleResponseWithResult:[DictionaryUtils
                                                                   convertToJsonWithDictionary:
                                                                   [bucketModel toDictionary]]]
                                  toDictionary]];
         
         return;
       }
       
       [self sendEventWithName:EventNames.EVENT_BUCKET_CREATED
                   body:[[Response errorResponseWithMessage:@"Bucket insertion to db failed"]
                         toDictionary]];
     };
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
       
       [self sendEventWithName:EventNames.EVENT_BUCKET_CREATED
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
     BucketDeleteCallback *callback = [[BucketDeleteCallback alloc] init];
     callback.onSuccess = ^{
       if([[[self bucketRepository] deleteById:bucketId] isSuccess]){
         [self sendEventWithName:EventNames.EVENT_BUCKET_DELETED
                            body:[[SingleResponse successSingleResponseWithResult:bucketId]
                                  toDictionary]];
       }
     };
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
       NSLog(@"Error with deleting bucket. cause:%@", errorMessage);
       [self sendEventWithName:EventNames.EVENT_BUCKET_DELETED
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
     
     FileDeleteCallback *callback = [[FileDeleteCallback alloc] init];
     callback.onSuccess = ^{
       NSLog(@"Success deletion");
       if([[self fileRepository] deleteById:fileId]){
         FileDeleteModel *fileDeleteModel = [[FileDeleteModel alloc] initWithBucketId:bucketId
                                                                               fileId:fileId];
         NSString *result = [DictionaryUtils
                             convertToJsonWithDictionary:[fileDeleteModel toDictionary]];
         
         [self sendEventWithName:EventNames.EVENT_FILE_DELETED
                            body:[[SingleResponse successSingleResponseWithResult:result]
                                  toDictionary]];
         return;
       }
       
       [self sendEventWithName:EventNames.EVENT_FILE_DELETED
                          body:[[Response errorResponseWithMessage:@"File deletion failed in DB."]
                                toDictionary]];
     };
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {

       NSString * result = [DictionaryUtils convertToJsonWithDictionary:
                            [[Response errorResponseWithCode:errorCode
                                              andWithMessage:errorMessage]toDictionary]];
       [self sendEventWithName:EventNames.EVENT_FILE_DELETED
                          body:result];
     };
     [[self storjWrapper] deleteFile:fileId fromBucket:bucketId withCompletion:callback];
   } expirationHandler:^{
     
   }];
}

RCT_REMAP_METHOD(downloadFile,
                 downloadFileWithBucketId:(NSString *) bucketId
                 fileId:(NSString *) fileId
                 localPath:(NSString *) localPath
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
//    NSLog(@"Downloading \nfile %@ \nfrom %@ \nto %@", fileId, bucketId, localPath)
  //TODO normal flow
  
  if(!fileId || fileId.length == 0){
    return;
  }
  
  if(!localPath || localPath.length == 0){
    return;
  }
  
  __block double downloadProgress = 0;
  long fileRef = 0;
  NSLog(@"Downloading file %@ to %@", fileId, localPath);
  
  FileDownloadCallback *callback = [[FileDownloadCallback alloc]init];
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    NSLog(@"File download error %d, %@", errorCode, errorMessage);
  };
  callback.onDownloadComplete = ^(NSString *fileId, NSString *localPath) {
    NSLog(@"Download complete, %@, %@", fileId, localPath);
  };
  callback.onDownloadProgress = ^(NSString *fileId, double progress, double downloadedBytes, double totalBytes) {
    NSLog(@"Download progress for %@, %f", fileId, progress);
  };
  [self.storjWrapper downloadFile:fileId
                       fromBucket:bucketId
                        localPath:localPath
                   withCompletion:callback];
}

RCT_REMAP_METHOD(uploadFile,
                  uploadFileWithBucketId:(NSString *)bucketId
                  withLocalPath:(NSString *) localPath){
  [MethodHandler
   invokeBackgroundRemainWithParams:@{@KEY_TASK_NAME:@"UploadFile"}
   methodHandlerBlock:^(NSDictionary *params, UIBackgroundTaskIdentifier taskId) {
     if(!bucketId || bucketId.length == 0){
       return;
     }
     
     if(!localPath || localPath.length == 0){
       return;
     }
     
     __block double uploadProgress = 0;
     long fileRef = 0;
     NSLog(@"Uploading file located at: %@ into bucket: %@", localPath, bucketId);
     
     NSNumber *fileSize = [FileUtils getFileSizeWithPath:localPath];
     NSString *fileName = [FileUtils getFileNameWithPath:localPath];
     
     UploadFileDbo *dbo = [[UploadFileDbo alloc] initWithFileHandle:0
                                                           progress:0
                                                               size:[fileSize longValue]
                                                           uploaded:0
                                                               name:fileName
                                                                uri:localPath
                                                           bucketId:bucketId];
     
     FileUploadCallback *callback = [[FileUploadCallback alloc] init];
     
     callback.onProgress = ^(NSString *fileId, double progress, double uploadedBytes, double totalBytes) {
       if([dbo fileHandle] == 0){
         return;
       }
       
       if(progress - uploadProgress > 0.02){
         uploadProgress = progress;
       }
       
       if(uploadProgress != progress){
         return;
       }
       [dbo set_progress: uploadProgress];
       [dbo set_uploaded: uploadedBytes];
         UploadFileModel * fileModel =[[UploadFileModel alloc] initWithUploadFileDbo:dbo];
         Response *response = [[self uploadFileRepository] updateByModel:fileModel];
         if([response isSuccess]){
           NSDictionary *body = @{UploadFileContract.FILE_HANDLE : @([dbo fileHandle]),
                                  UploadFileContract.PROGRESS : @(uploadProgress),
                                  UploadFileContract.UPLOADED : @(uploadedBytes)};
           
             [self sendEventWithName:EventNames.EVENT_FILE_UPLOAD_PROGRESS
                                body: body];
         }
         //NOTIFY IN NOTIFICATION CENTER
     };
     
     callback.onSuccess = ^(SJFile * file){
       FileModel *fileModel = [[FileModel alloc] initWithSJFile:file];
       [[self uploadFileRepository] deleteById:[NSString stringWithFormat:@"%ld", [dbo fileHandle]]];
       [[self fileRepository] insertWithModel:fileModel];
       NSDictionary *bodyDict = @{UploadFileContract.FILE_HANDLE:@([dbo fileHandle]),
                                  FileContract.FILE_ID : [DictionaryUtils checkAndReturnNSString:
                                                          [fileModel _fileId]]};
       [self sendEventWithName:EventNames.EVENT_FILE_UPLOAD_SUCCESSFULLY
                          body:bodyDict];
       
       //NOTIFY IN NOTIFICATION CENTER
     };
     
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
       NSString *dboId = [NSString stringWithFormat:@"%ld", [dbo fileHandle]];
       Response *deleteResponse = [[self uploadFileRepository] deleteById:dboId];
       
       [self sendEventWithName:EventNames.EVENT_FILE_UPLOAD_ERROR
                          body:@{@"errorMessage":errorMessage,
                                 @"errorCode" : @(errorCode),
                                 UploadFileContract.FILE_HANDLE: dboId}];
       
       //NOTIFY IN NOTIFICATION CENTER
     };
     fileRef = [[self storjWrapper] uploadFile:localPath toBucket:bucketId withCompletion:callback];
     @synchronized (dbo) {
       [dbo set_fileHandle:fileRef];
       UploadFileModel *fileModel = [[UploadFileModel alloc] initWithUploadFileDbo:dbo];
       Response *insertResponse = [[self uploadFileRepository] insertWithModel:fileModel];
       if([insertResponse isSuccess]){
         NSDictionary *eventDict =@{@"fileHandle": @([dbo fileHandle])};
         NSLog(@"Upload started");
         [self sendEventWithName:EventNames.EVENT_FILE_UPLOAD_START
                            body:eventDict];
       }
     }
   }
   expirationHandler:^{
     
   }];
}

//resolver:(RCTPromiseResolveBlock) resolve
//rejecter:(RCTPromiseRejectBlock) reject){

-(void) arrayShift:(NSMutableArray *) array position:(int)position length:(int) length{
  while(position < length -1){
    array[position] = array[position + 1];
    position++;
  }
}

@end
