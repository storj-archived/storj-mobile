//
//  StorjLibIos.m
//  StorjMobile
//
//  Created by Barterio on 1/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "StorjLibIos.h"

@implementation StorjLibIos
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(register,
                 login:(NSString *)login
                 password:(NSString *)password
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  RCTLogInfo(@"Register clicked from rct");
  NSLog(@"Register clicked");
  StorjWrapper *wrapper = [[StorjWrapper alloc] init];
  RegistrationCallback *callback = [[RegistrationCallback alloc] init];
  callback.onSuccess = ^(NSString *email){
    NSString * mnemonic = [wrapper generateMnemonic:256];
    NSDictionary *object = @{
                             @"isSuccess" : @YES,
                             @"mnemonic" : mnemonic,
//                             @"errorMessage" :
                             };
    resolve(object);
  };
  
  callback.onError = ^(NSString *message){
    RCTLogInfo(@"Error: %@", message);
    //  (NSString *__strong, NSString *__strong, NSError *__strong)
    NSDictionary *object = @{
                             @"isSuccess" : @NO,
//                             @"mnemonic" : mnemonic,
                             @"errorMessage" : message
                             };
    resolve(object);
    //    reject(@"regEr", message, nil);
  };
  [wrapper registerUser:login password:password registerCallback:callback];
}

@end


