//
//  ListResponse.m
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "ListResponse.h"

@implementation ListResponse

@synthesize _result;

-(instancetype)initWithSuccess:(BOOL)isSuccess
                    withResult:(NSArray *)result
               andErrorMessage:(NSString *)errorMessage{
  
  if(self = [super initWithSuccess:isSuccess
               andWithErrorMessage:errorMessage]){
    _result = result;
  }
  return self;
}

-(instancetype) initWithSuccess:(BOOL)isSuccess
                     withResult:(NSArray *)result
                  withErrorCode:(int)errorCode
                andErrorMessage:(NSString *)errorMessage{
  
  if(self = [super initWithSuccess:isSuccess
                     withErrorCode:errorCode
               andWithErrorMessage:errorMessage]){
    _result = result;
  }
  return self;
}

-(NSDictionary *) toDictionary{
  NSMutableDictionary * resultDictionary = [[NSMutableDictionary alloc]
                                            initWithDictionary:[super toDictionary]];
  [resultDictionary setObject:@RESPONSE_KEY_RESULT forKey:_result];
  NSLog(@"ListResponse: %@", resultDictionary);
  return resultDictionary;
}

@end
