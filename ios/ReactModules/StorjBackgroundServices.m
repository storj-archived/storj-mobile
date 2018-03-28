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

RCT_EXPORT_MODULE(@"ServiceModule");

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
    _bucketRepository = [[BucketRepository alloc] initWithDB:_database];
  }
  return _bucketRepository;
}

-(FileRepository *) fileRepository{
  if(!_fileRepository){
    _fileRepository = [[FileRepository alloc] initWithDB:_database];
  }
  return _fileRepository;
}

-(UploadFileRepository *) uploadFileRepository{
  if(!_fileRepository){
    _uploadFileRepository = [[UploadFileRepository alloc] initWithDB:_database];
  }
  return _uploadFileRepository;
}

-(StorjWrapper *)storjWrapper{
  if(!_storjWrapper){
    _storjWrapper = [[StorjWrapper alloc] init];
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
         [self.bucketRepository deleteAll];
         //db close
         [self sendEventWithName:EventNames.EVENT_BUCKETS_UPDATED
                            body:@(YES)];
         return;
       }
       [_database beginTransaction];
       
       NSMutableArray <BucketDbo *> * bucketDbos = [[NSMutableArray alloc] initWithArray:[self._bucketRepository getAll] copyItems:YES];
       int length = [buckets count];
     outer:
       for (BucketDbo* bucketDbo in bucketDbos) {
         int i = 0;
         NSString *dboId = [bucketDbo getId];
         
         do{
           BucketModel *bucketModel = [[BucketModel alloc] initWithStorjBucketModel:bucketsArray[i]];
           NSString * modelId = [bucketModel _id];
           if([dboId isEqualToString:modelId]){
             [_bucketRepository updateByModel:bucketModel];
             
             [self arrayShift:buckets position:i length:length];
             
             length--;
             goto outer;
           }
           i++;
         } while (i < length);
         
         [_bucketRepository deleteById:dboId];
       }
       
       for (int i = 0; i < length; i++){
         [_bucketRepository insertWithModel:[[BucketModel alloc]
                                             initWithStorjBucketModel:buckets[i]]];
       }
       [_database commit];
       
       [self sendEventWithName:EventNames.EVENT_BUCKETS_UPDATED
                          body:@(YES)];
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
       NSMutableArray *files = [NSMutableArray arrayWithArray:fileArray];
       if(!files){
         return;
       }
       if([files count] == 0){
         [_fileRepository deleteAllFromBucket:bucketId];
         //dbClose???
         [self sendEventWithName:EventNames.EVENT_FILES_UPDATED
                     body:@(YES)];
         return;
       }
       
       [_database beginTransaction];
       NSMutableArray <FileDbo *> *fileDbos = [NSMutableArray arrayWithArray
                                               :[_fileRepository getAllFromBucket:bucketId]];
       
       int length = [files count];
       
     outer:
       for (FileDbo *dbo in fileDbos) {
         int i = 0;
         NSString *dboId = [dbo getId];
         
         do {
           FileModel *fileModel = [[FileModel alloc] initWithSJFile:files[i]];
           NSString *fileId = [fileModel _fileId];
           
           if([dboId isEqualToString:fileId]){
             [_fileRepository updateByModel:fileModel];
             [self arrayShift:files
                     position:i
                       length:length];
           }
         } while(i < length);
         [_fileRepository deleteById:dboId];
       }
       for(int i = 0; i < length; i++){
         [_fileRepository insertWithModel:[[FileModel alloc] initWithSJFile:files[i]]];
       }
       [_database commit];
       // close??
       
       [self sendEventWithName:EventNames.EVENT_FILES_UPDATED
                   body:@(YES)];
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
  
  [MethodHandler
   invokeBackgroundRemainWithParams:@{@KEY_TASK_NAME:@"createBucket"}
   methodHandlerBlock:^(NSDictionary * dictionary, UIBackgroundTaskIdentifier taskId){
     
     BucketCreateCallback *callback = [[BucketCreateCallback alloc]init];
     callback.onSuccess = ^(SJBucket * sjBucket) {
       SingleResponse *response = nil;
       BucketModel *bucketModel = [[BucketModel alloc] initWithStorjBucketModel:sjBucket];
       
       Response *insertionResponse = [_bucketRepository insertWithModel:bucketModel];
       if(insertionResponse._isSuccess){
         //send event success with::
         [self sendEventWithName: EventNames.EVENT_BUCKET_CREATED
                            body:[SingleResponse
                                  successSingleResponseWithResult:[DictionaryUtils
                                                                   convertToJsonWithDictionary:
                                                                   [bucketModel toDictionary]]]];
         
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
       if([[_bucketRepository deleteById:bucketId] isSuccess]){
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
       if([_fileRepository deleteById:fileId]){
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
  //  NSLog(@"Downloading file ")
  //TODO normal flow
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
  [self.storjWrapper downloadFile:fileId fromBucket:bucketId withCompletion:callback];
}

RCT_REMAP_METHOD(cancelUpload,
                 cancelUploadByFileRef:(long)fileRef
                 resolver:(RCTPromiseResolveBlock) resolve
                 rejecter:(RCTPromiseRejectBlock) reject){
}

RCT_REMAP_METHOD(cancelDownload,
                 cancelDownloadByFileRef:(long)fileRef
                 resolver:(RCTPromiseResolveBlock) resolve
                 rejecter:(RCTPromiseRejectBlock) reject){
}

RCT_REMAP_METHOD(uploadFile,
                  uploadFileWithBucketId:(NSString *)bucketId
                  withLocalPath:(NSString *) localPath
                  isSynced: (BOOL) isSynced){
  if(!bucketId || bucketId.length == 0){
    return;
  }
  
  if(!localPath || localPath.length == 0){
    return;
  }
  
  __block int uploadProgress = 0;
  NSNumber *fileRef;
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
    int currentProgress = round(progress * 10);
    
    if(uploadProgress != currentProgress){
      uploadProgress = currentProgress;
      
      [dbo setProp:UploadFileContract.PROGRESS fromDouble:uploadProgress];
      [dbo setProp:UploadFileContract.UPLOADED fromDouble:uploadedBytes];
      
      UploadFileModel * fileModel =[[UploadFileModel alloc] initWithUploadFileDbo:dbo];
      Response * updateResponse = [_uploadFileRepository updateByModel:fileModel];
      
      [self sendEventWithName:EventNames.EVENT_FILE_UPLOAD_PROGRESS
                         body:@{UploadFileContract.FILE_HANDLE : @(dbo.getId),
                                UploadFileContract.PROGRESS : @(uploadProgress),
                                UploadFileContract.UPLOADED : @(uploadedBytes)}];
      
      //NOTIFY IN NOTIFICATION CENTER
    }
  };
  
  callback.onSuccess = ^(NSString * fileId){
    FileModel *fileModel = [[FileModel alloc] initWithBucketId:bucketId
                                                       created:@""
                                                       erasure:@""
                                                          hmac:@""
                                                        fileId:fileId
                                                         index:@""
                                                      mimeType:@""
                                                          name:fileName
                                                          size:[fileSize longValue]
                                                   isDecrypted:YES
                                                     isStarred:NO
                                                      isSynced:NO];
    Response *deleteResponse = [_uploadFileRepository deleteById:fileId];
    Response *insertResponse = [_fileRepository insertWithModel:fileModel];
    
    [self sendEventWithName:EventNames.EVENT_FILE_UPLOAD_SUCCESSFULLY
                       body:@{UploadFileContract.FILE_HANDLE:@([dbo fileHandle]),
                              FileContract.FILE_ID : [fileModel _fileId]}];
    
    //NOTIFY IN NOTIFICATION CENTER
  };
  
  
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    NSString *dboId = [NSString stringWithFormat:@"%ld", [dbo getId]];
    Response *deleteResponse = [_uploadFileRepository deleteById:dboId];
    
    [self sendEventWithName:EventNames.EVENT_FILE_UPLOAD_ERROR
                       body:@{@"errorMessage":errorMessage,
                              @"errorCode" : @(errorCode),
                              UploadFileContract.FILE_HANDLE: dboId}];
    
    //NOTIFY IN NOTIFICATION CENTER
  };
  [self.storjWrapper uploadFile:localPath toBucket:bucketId withCompletion:callback fileRef:fileRef];
  @synchronized (dbo) {
    [dbo setProp:UploadFileContract.FILE_HANDLE fromLong:fileRef];
    UploadFileModel *fileModel = [[UploadFileModel alloc] initWithUploadFileDbo:dbo];
    Response *insertResponse = [_uploadFileRepository insertWithModel:fileModel];
    if([insertResponse isSuccess]){
      [self sendEventWithName:EventNames.EVENT_FILE_UPLOAD_START
                         body:@{@"fileHandle": @([dbo getId])}];
    }
  }
}

-(void) arrayShift:(NSMutableArray *) array position:(int)position length:(int) length{
  while(position < length -1){
    array[position] = array[position + 1];
    position++;
  }
}

@end
