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
  if(mnemonic){
//    NSDictionary *object = @{@KEY_IS_SUCCESS : @YES,
//                             @KEY_RESULT: @{@"mnemonic":mnemonic}
//                             };
//    resolve(object);
    resolve(mnemonic);
  } else {
    resolve(@{@KEY_IS_SUCCESS:@NO,
               @KEY_ERROR_MESSAGE: @"Unable to generate mnemonic",
               });
  }
}

RCT_REMAP_METHOD(checkMnemonic,
                 checkMnemonic:(NSString *) mnemonic
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
//  BOOL isMnemonicValid = [self.storjWrapper checkMnemonic];
//  resolve(@{@KEY_IS_SUCCESS:@(isMnemonicValid)});
  BOOL isMnemonicValid = [self.storjWrapper checkMnemonic:mnemonic];
  resolve(@(isMnemonicValid));
}

#pragma mark - Keys requsts
RCT_REMAP_METHOD(verifyKeys,
                 verifyKeysWithEmail:(NSString *)email
                 password:(NSString *)password
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject ){
  BOOL isVerificationSuccessfull =
    [self.storjWrapper verifyKeysWithUserEmail:email andPassword:password];
//  resolve(@{@KEY_IS_SUCCESS:@(isVerificationSuccessfull)});
resolve(@(isVerificationSuccessfull));
}

RCT_REMAP_METHOD(keysExists,
                 keysExistWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  
  BOOL areKeysExist = [self.storjWrapper authFileExist];
  resolve(@(areKeysExist));
//  resolve(@{@KEY_IS_SUCCESS: @(areKeysExist)});
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
  //revrite using adequate response;
  resolve(@(result));
}

RCT_EXPORT_METHOD(getKeys: (NSString *) passcode
                  successCallback:(RCTResponseSenderBlock) success
                  errorCallback:(RCTResponseSenderBlock) error)
{
  NSDictionary * authCredentials = [self.storjWrapper getKeysWithPassCode:passcode];
  NSLog(@"%@", authCredentials);
  if(!authCredentials || authCredentials.count != 3){
    NSLog(@"Error with externing keys");
    error(@[@{@"errorMessage":@"Error with getting keys. Entries.count ≠ 3"}]);
  } else{
    NSLog(@"Successfull keys extern");
    success(@[authCredentials]);
  }
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
               @"mnemonic":mnemonic});
  };
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    NSDictionary *object = @{@KEY_IS_SUCCESS : @NO,
                             @KEY_ERROR_MESSAGE : errorMessage};
    resolve(object);
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
    if(bucketDictionary){
      resolve(@{@KEY_IS_SUCCESS:@YES,
                 @KEY_RESULT:bucketDictionary
                 });
    } else {
      resolve(@{@KEY_IS_SUCCESS:@(NO)
                 });
      }
  };
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    resolve(@{@KEY_IS_SUCCESS:@NO,
              @KEY_ERROR_MESSAGE:errorMessage
              });
    
  };
  [self.storjWrapper createBucket:bucketName withCallback:callback];
}

RCT_REMAP_METHOD(deleteBucket,
                 deleteBucketWithBucketId: (NSString *) bucketId
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  NSLog(@"Deleting bucket %@", bucketId);
  BucketDeleteCallback *callback = [[BucketDeleteCallback alloc] init];
  callback.onSuccess = ^{
    NSLog(@"Successfully deleted bucket %@",bucketId);
    resolve(@{@KEY_IS_SUCCESS:@YES});
  };
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    NSLog(@"Error with deleting bucket. cause:%@", errorMessage);
    resolve(@{@KEY_IS_SUCCESS: @NO,
               @KEY_ERROR_MESSAGE: errorMessage
               });
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
//      resolve(@{@KEY_IS_SUCCESS: @YES,
//                 @KEY_RESULT:bucketsArray
//                 });
      resolve(bucketsArray);
    } else {
      resolve(@{@KEY_IS_SUCCESS: @NO});
    }
  };
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    resolve(@{@KEY_IS_SUCCESS: @NO});
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
              @KEY_RESULT:fileArray});
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
//  FileDownloadCallback *callback = 
}

RCT_REMAP_METHOD(uploadFile,
                 uploadFileWithBucketId:(NSString *)
                 bucketId withLocalPath:(NSString *)
                 localPath resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  
}
@end


