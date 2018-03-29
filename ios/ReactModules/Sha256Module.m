//
//  Sha256Module.m
//  StorjMobile
//
//  Created by Barterio on 3/28/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "Sha256Module.h"

#import <React/RCTUtils.h>
#import <React/RCTImageLoader.h>

#include <CommonCrypto/CommonDigest.h>

@implementation Sha256Module

RCT_EXPORT_MODULE(Sha256ModuleIOS)

RCT_EXPORT_METHOD(sha256: (NSString *) data
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)

{
  const char* str = [data UTF8String];
  unsigned char result[CC_SHA256_DIGEST_LENGTH];
  CC_SHA256(str, strlen(str), result);
  
  NSMutableString *ret = [NSMutableString stringWithCapacity:CC_SHA256_DIGEST_LENGTH*2];
  for(int i = 0; i<CC_SHA256_DIGEST_LENGTH; i++)
  {
    [ret appendFormat:@"%02x",result[i]];
  }
  
  resolve(ret);
}

@end
