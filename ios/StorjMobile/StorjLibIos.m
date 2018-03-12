//
//  StorjLibIos.m
//  StorjMobile
//
//  Created by Barterio on 1/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "StorjLibIos.h"
@import StorjIOS;

@interface StorjLibIos()
@property (nonatomic, strong) StorjWrapper *storjWrapper;
@end

#define KEY_IS_SUCCESS "isSuccess"
#define KEY_RESULT "result"
#define KEY_ERROR_MESSAGE "errorMessage"

@implementation StorjLibIos

@synthesize storjWrapper = _storjWrapper;
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"uploadFile"];
}

-(StorjWrapper *)storjWrapper{
  if(!_storjWrapper){
    _storjWrapper = [[StorjWrapper alloc] init];
  }
  return _storjWrapper;
}

#pragma mark - Mnemonic requests
RCT_REMAP_METHOD(generateMnemonic,
                 generateMnemonicWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  
  NSString *mnemonic = [self.storjWrapper generateMnemonic:256];
  NSDictionary *result = nil;
  if(mnemonic){
    result = @{@KEY_IS_SUCCESS : @YES,
                @KEY_RESULT: mnemonic};
  } else {
    result =@{@KEY_IS_SUCCESS:@NO,
               @KEY_ERROR_MESSAGE: @"Unable to generate mnemonic"};
  }
  resolve(result);
}

RCT_REMAP_METHOD(checkMnemonic,
                 checkMnemonic:(NSString *) mnemonic
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  BOOL isMnemonicValid = [self.storjWrapper checkMnemonic:mnemonic];
  resolve(@{@KEY_IS_SUCCESS : @(isMnemonicValid)});
}

#pragma mark - Keys requsts
RCT_REMAP_METHOD(verifyKeys,
                 verifyKeysWithEmail:(NSString *)email
                 password:(NSString *)password
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject ){
  BOOL isVerificationSuccessfull =
  [self.storjWrapper verifyKeysWithUserEmail:email andPassword:password];
  resolve(@{@KEY_IS_SUCCESS:@(isVerificationSuccessfull)});
}

RCT_REMAP_METHOD(keysExists,
                 keysExistWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  
  BOOL areKeysExist = [self.storjWrapper authFileExist];
  NSDictionary *response = nil;
  if(areKeysExist){
    response = @{@KEY_IS_SUCCESS:@YES};
  } else {
    response = @{@KEY_IS_SUCCESS:@NO,
                  @KEY_ERROR_MESSAGE:@"Unable to get keys"};
  }
  resolve(response);
}

RCT_REMAP_METHOD(importKeys,
                 importKeysWithEmail:(NSString *)email
                 password: (NSString *)password
                 mnemonic: (NSString *) mnemonic
                 passcode: (NSString *) passcode
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  BOOL result = [self.storjWrapper importKeysWithEmail:email
                                              password:password
                                              mnemonic:mnemonic
                                           andPasscode:passcode];
  resolve(@{@KEY_IS_SUCCESS:@(result)});
}


RCT_EXPORT_METHOD(getKeys: (NSString *) passcode
                  successCallback:(RCTPromiseResolveBlock) resolve
                  errorCallback:(RCTPromiseRejectBlock) reject)
{
  NSDictionary * authCredentials = [self.storjWrapper getKeysWithPassCode:passcode];
  NSLog(@"%@", authCredentials);
  NSDictionary *response = nil;
  if(!authCredentials || authCredentials.count != 3){
    NSLog(@"Error externing keys");
    response = @{@KEY_IS_SUCCESS:@(NO),
                  @KEY_ERROR_MESSAGE:@"Error with getting keys. Entries.count ≠ 3"};
  } else{
    NSLog(@"Successfull keys extern");
    response = @{@KEY_IS_SUCCESS:@(YES),
                  @KEY_RESULT:authCredentials};
  }
  resolve(response);
}

RCT_REMAP_METHOD(register,
                 registerWithLogin:(NSString *)login
                 password:(NSString *)password
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  RegistrationCallback *callback = [[RegistrationCallback alloc] init];
  callback.onSuccess = ^(NSString *email){
    NSString * mnemonic = [_storjWrapper generateMnemonic:256];
    resolve(@{@KEY_IS_SUCCESS : @YES,
                              @KEY_RESULT:mnemonic});
  };
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    resolve(@{@KEY_IS_SUCCESS : @NO,
                              @KEY_ERROR_MESSAGE : errorMessage});
  };
  
  [self.storjWrapper registerUser:login
                         password:password
                     withCallback:callback];
}

#pragma mark - Bucket requests
RCT_REMAP_METHOD(createBucket,
                 createBucketWithBucketName: (NSString *) bucketName
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  BucketCreateCallback *callback = [[BucketCreateCallback alloc]init];
  callback.onSuccess = ^(NSDictionary * _Nullable bucketDictionary) {
    NSDictionary *response = nil;
    if(bucketDictionary){
      response = @{@KEY_IS_SUCCESS:@YES,
                    @KEY_RESULT: [StorjLibIos convertToJsonWithDictionary: bucketDictionary]};
    } else {
      response = @{@KEY_IS_SUCCESS:@NO,
                    @KEY_ERROR_MESSAGE:@"Unable to create bucket."};
    }
    resolve(response);
  };
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    resolve(@{@KEY_IS_SUCCESS:@NO,
                              @KEY_ERROR_MESSAGE:errorMessage});
  };
  
  [self.storjWrapper createBucket:bucketName
                     withCallback:callback];
}

RCT_REMAP_METHOD(deleteBucket,
                 deleteBucketWithBucketId: (NSString *) bucketId
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  NSLog(@"Deleting bucket %@", bucketId);
  BucketDeleteCallback *callback = [[BucketDeleteCallback alloc] init];
  callback.onSuccess = ^{
    NSLog(@"Successfully deleted bucket %@",bucketId);
    resolve(@{@KEY_IS_SUCCESS: @YES});
  };
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    NSLog(@"Error with deleting bucket. cause:%@", errorMessage);
    resolve(@{@KEY_IS_SUCCESS: @NO,
               @KEY_ERROR_MESSAGE: errorMessage});
  };
  
  [self.storjWrapper deleteBucket:bucketId withCompletion:callback];
}

RCT_REMAP_METHOD(getBuckets,
                 getBucketsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  BucketListCallback *callback = [[BucketListCallback alloc] init];
  callback.onSuccess = ^(NSArray<NSDictionary *> * _Nullable bucketsArray) {
    if(bucketsArray){
      resolve(@{@KEY_IS_SUCCESS: @YES,
                                @KEY_RESULT:[StorjLibIos convertToJsonWithArray: bucketsArray]});
    } else {
      resolve(@{@KEY_IS_SUCCESS: @NO});
    }
  };
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    resolve(@{@KEY_IS_SUCCESS: @NO,
               @KEY_ERROR_MESSAGE:errorMessage});
  };
  [self.storjWrapper getBucketListWithCompletion:callback];
}

#pragma mark - File requests
RCT_REMAP_METHOD(listFiles,
                 listFilesWithBucketId:(NSString *)bucketId
                 listFilesWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSLog(@"Listing files for bucketId: %@", bucketId);
  if(!bucketId || bucketId.length == 0){
    resolve(@{@KEY_IS_SUCCESS:@(NO),
                              @KEY_ERROR_MESSAGE:@"Invalid bucket id"});
    return;
  }
  FileListCallback *callback = [[FileListCallback alloc]init];
  callback.onSuccess = ^(NSArray<NSDictionary *> * _Nullable fileArray) {
    resolve(@{@KEY_IS_SUCCESS:@(YES),
                              @KEY_RESULT:[StorjLibIos convertToJsonWithArray: fileArray]});
  };
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    resolve(@{@KEY_IS_SUCCESS:@(NO),
                              @KEY_ERROR_MESSAGE:errorMessage});
  };
  [self.storjWrapper listFiles:bucketId withCompletion:(callback)];
}

RCT_REMAP_METHOD(deleteFile,
                 deleteFileWithFileId: (NSString *) fileId
                 buecketId: (NSString *) bucketId
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  NSLog(@"Deleting file %@", fileId);
  FileDeleteCallback *callback = [[FileDeleteCallback alloc] init];
  callback.onSuccess = ^{
    NSLog(@"Successfully deleted file %@",fileId);
    resolve(@{@KEY_IS_SUCCESS:@YES});
  };
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    NSLog(@"Error with deleting bucket. cause:%@", errorMessage);
    resolve(@{@KEY_IS_SUCCESS: @NO,
                              @KEY_ERROR_MESSAGE: errorMessage});
  };
  
  [self.storjWrapper deleteFile:fileId fromBucket:bucketId withCompletion:callback];
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
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  if(!bucketId || bucketId.length == 0){
    resolve(@{@KEY_IS_SUCCESS:@(NO), @KEY_ERROR_MESSAGE:@"Invalid bucketId"});
    return;
  }
  
  if(!localPath || localPath.length == 0){
    resolve(@{@KEY_IS_SUCCESS:@(NO), @KEY_ERROR_MESSAGE:@"Invalid localPath"});
    return;
  }
  
  __block int uploadProgress = 0;
  long fileRef = 0;
  NSLog(@"Uploading file located at: %@ into bucket: %@", localPath, bucketId);
  
  FileUploadCallback *callback = [[FileUploadCallback alloc] init];
  callback.onSuccess = ^{
    //TODO Return RESULT as JSON STRING
    NSLog(@"File ref: %ld", fileRef);
    NSLog(@"File uploaded");
  };
  
  callback.onProgress = ^(NSString *fileId, double progress, double uploadedBytes, double totalBytes) {
    int currentProgress = round(progress * 10);
    
    if(uploadProgress != currentProgress){
      uploadProgress = currentProgress;
      NSLog(@"file upload progress: %@, %d", fileId, uploadProgress);
      [self sendEventWithName:@"uploadFile" body:@{@"bucketId": bucketId,
                                                   @"filePath": localPath,
                                                   @"progress": @(progress),
                                                   @"uploadedBytes": @(uploadProgress),
                                                   @"totalBytes": @(totalBytes),
                                                   @"filePointer":@(fileRef)}];
    }
  };
  
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    NSLog(@"error uploading file: %d, %@", errorCode, errorMessage);
  };
  fileRef = [self.storjWrapper uploadFile:localPath toBucket:bucketId withCompletion:callback];
}

+(NSString *) convertToJsonWithDictionary:(NSDictionary *)dictionary{
  NSError * err;
  NSData * jsonData = [NSJSONSerialization dataWithJSONObject:dictionary options:0 error:&err];
  if(!jsonData){
    NSLog(@"Error while serialization");
    return @"";
  }
  NSString *resultString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  NSLog(@"result: %@", resultString);
  return resultString;
}

+(NSString *) convertToJsonWithArray:(NSArray *)array{
  NSError * err;
  NSData * jsonData = [NSJSONSerialization dataWithJSONObject:array options:0 error:&err];
  if(!jsonData){
    NSLog(@"Error while serialization");
    return @"";
  }
  NSString *resultString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  NSLog(@"result: %@", resultString);
  return resultString;
}

//-(void)resolveWithBlock:(RCTPromiseResolveBlock) resolve andDictionary:(NSDictionary *)response{
//  resolve([StorjLibIos convertToJsonWithDictionary:response]);
//}

@end


