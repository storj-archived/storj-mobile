//
//  StorjLibIos.m
//  StorjMobile
//
//  Created by Barterio on 1/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "StorjLibIos.h"

@interface StorjLibIos()
@property (nonatomic) StorjWrapper * storjWrapper;
@end

@implementation StorjLibIos
RCT_EXPORT_MODULE();


-(StorjWrapper *)storjWrapper{
  if(!_storjWrapper){
    _storjWrapper = [[StorjWrapper alloc] init];
  }
  return _storjWrapper;
}

RCT_REMAP_METHOD(generateMnemonic,
                 generateMnemonicWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  
  NSString *mnemonic = [_storjWrapper generateMnemonic:256];
  if(mnemonic){
    NSDictionary *object = @{@"isSuccess" : @YES, @"mnemonic" : mnemonic,};
    resolve(object);
  } else {
    reject(STORJ_E_GENERATE_MNEMONIC,@"Unable to generate mnemonic", nil);
  }
}

RCT_REMAP_METHOD(checkMnemonic,
                 checkMnemonic:(NSString *) mnemonic
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  BOOL isMnemonicValid = [_storjWrapper checkMnemonic];
  if(isMnemonicValid){
    resolve(@{@"isSuccess":@YES});
  } else {
    reject(STORJ_E_CHECK_MNEMONIC, @"Mnemonic is not correct", nil);
  }
}

RCT_REMAP_METHOD(verifyKeys,
                 verifyKeysWithEmail:(NSString *)email
                 password:(NSString *)password
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject ){
  RCTLogInfo(@"STUB");
}

RCT_REMAP_METHOD(keysExist,
                 keysExistWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  RCTLogInfo(@"STUB");
}

RCT_REMAP_METHOD(importKeys,
                 importKeysWithEmail:(NSString *)email
                 password: (NSString *)password
                 mnemonic: (NSString *) mnemonic
                 passcode: (NSString *) passcode
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject
                 ){
  RCTLogInfo(@"STUB");
}

RCT_REMAP_METHOD(register,
                 registerWithLogin:(NSString *)login
                 password:(NSString *)password
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  RegistrationCallback *callback = [[RegistrationCallback alloc] init];
  callback.onSuccess = ^(NSString *email){
    resolve(@{@"isSuccess" : @YES,});
  };
  
  callback.onError = ^(NSString *message){
    NSDictionary *object = @{@"isSuccess" : @NO,@"errorMessage" : message};
    resolve(object);
    //    reject(@"regEr", message, nil);
  };
  [_storjWrapper registerUser:login password:password registerCallback:callback];
}

RCT_REMAP_METHOD(createBucket,
                 createBucketWithBucketName: (NSString *) bucketName
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  SJBucketCreateCallBack callback = ^(NSDictionary * _Nullable bucketDictionary, NSError * _Nullable error)
  {
    if(bucketDictionary){
      RCTLogInfo(@"NSDict: %@", [bucketDictionary description]);
    }
    if(!error && bucketDictionary)
    {
      resolve(bucketDictionary);
    } else
    {
      reject(STORJ_E_CREATE_BUCKET, @"Unable to create bucket", nil);
    }
  };
  
  [_storjWrapper createBucket:bucketName withCompletion:callback];
}

RCT_REMAP_METHOD(deleteBucket,
                 deleteBucketWithBucketName: (NSString *) bucketName
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  RCTLogInfo(@"STUB");
}

RCT_REMAP_METHOD(getBuckets,
                 getBucketsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [_storjWrapper getBucketListWithCompletion:^(NSArray<NSDictionary *> * _Nullable bucketsArray, NSError * _Nullable error) {
    if(!error && bucketsArray){
      //        resolve
    } else {
      //      reject
    }
  }];
}

@end


