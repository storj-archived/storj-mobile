//
//  Error.m
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "Error.h"
#import "DictionaryUtils.h"
@implementation Error

@synthesize _errorCode;
@synthesize _errorMessage;

-(instancetype)initWithErrorCode:(int)code
                 andErrorMessage:(NSString *)message{
  if(self = [super init]) {
    _errorMessage = !message ? @DEFAULT_ERROR_MESSAGE : message;
    _errorCode = code;
  }
  return self;
}

-(NSDictionary *)toDictionary{
  return @{@KEY_ERROR_CODE : @(_errorCode),
           @KEY_ERROR_MESSAGE : [DictionaryUtils checkAndReturnNSString:_errorMessage]};
}

@end
