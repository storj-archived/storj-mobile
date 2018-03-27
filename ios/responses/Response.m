//
//  Response.m
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "Response.h"

@implementation Response

@synthesize _error;
@synthesize _isSuccess;

-(instancetype)initWithSuccess:(BOOL)isSuccess
                  andWithError:(Error *)error{
  if(self = [super init]){
    _isSuccess = isSuccess;
    if(error != nil){
      _error = error;
    } else {
      _error = [[Error alloc]initWithErrorCode:0
                               andErrorMessage:@DEFAULT_ERROR_MESSAGE];
    }
  }
  return self;
}

-(instancetype)initWithSuccess:(BOOL)isSuccess
                 withErrorCode:(int)errorCode
           andWithErrorMessage:(NSString *)errorMessage{
  if(self = [super init]){
    _isSuccess = isSuccess;
    _error = [[Error alloc] initWithErrorCode:errorCode
                              andErrorMessage:errorMessage];
  }
  return self;
}

-(instancetype)initWithSuccess:(BOOL)isSuccess
           andWithErrorMessage:(NSString *)errorMessage{
  if(self = [super init]){
    _isSuccess = isSuccess;
    _error = [[Error alloc] initWithErrorCode:0
                              andErrorMessage:errorMessage];
  }
  return self;
}

+(Response *) successResponse{
  
  return [[Response alloc] initWithSuccess:YES
                              andWithError:nil];
}

+(Response *) errorResponseWithCode:(int) errorCode
                     andWithMessage: (NSString *) errorMessage{
  
  return [[Response alloc] initWithSuccess:NO
                             withErrorCode:errorCode
                       andWithErrorMessage:errorMessage];
}

+(Response *) errorResponseWithMessage: (NSString *) errorMessage{
  
  return [[Response alloc] initWithSuccess:NO
                       andWithErrorMessage:errorMessage];
}

- (NSDictionary *)toDictionary {
  
    return @{@RESPONSE_KEY_IS_SUCCESS : @(_isSuccess),
             @RESPONSE_KEY_ERROR : [_error toDictionary]};
}

@end
