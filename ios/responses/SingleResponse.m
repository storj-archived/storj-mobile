//
//  SingleResponse.m
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "SingleResponse.h"

@implementation SingleResponse

@synthesize _result;

-(instancetype)initWithSuccess:(BOOL)isSuccess
                    withResult:(NSString *)result
               andErrorMessage:(NSString *)errorMessage{
  if(self = [super initWithSuccess:isSuccess
               andWithErrorMessage:errorMessage]){
    _result = result;
  }
  return self;
}

-(instancetype)initWithSuccess:(BOOL)isSuccess
                    withResult:(NSString *)result
                 withErrorCode:(int)errorCode
               andErrorMessage:(NSString *)errorMessage{
  if(self = [super initWithSuccess:isSuccess
                     withErrorCode:errorCode
               andWithErrorMessage:errorMessage]){
    _result = result;
  }
  return self;
}

+(SingleResponse *) successSingleResponseWithResult:(NSString *)result{
  return [[SingleResponse alloc] initWithSuccess:YES
                                      withResult:result
                                 andErrorMessage:nil];
}

-(NSDictionary *) toDictionary{
  NSMutableDictionary * resultDictionary = [[NSMutableDictionary alloc]
                                            initWithDictionary:[super toDictionary]];
  [resultDictionary setObject:@RESPONSE_KEY_RESULT forKey:_result];
  return resultDictionary;
}

@end
