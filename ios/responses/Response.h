//
//  Response.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
#import "IConvertibleToJS.h"

@class STError;

#define RESPONSE_KEY_IS_SUCCESS "isSuccess"
#define RESPONSE_KEY_ERROR "error"
#define RESPONSE_KEY_RESULT "result"

@interface Response : NSObject<IConvertibleToJS>

@property (getter=isSuccess)BOOL _isSuccess;
@property (nonatomic, strong, getter=getError) STError * _error;

-(instancetype) initWithSuccess: (BOOL) isSuccess
                   andWithError: (STError *) error;

-(instancetype) initWithSuccess: (BOOL) isSuccess
                  withErrorCode: (int) errorCode
            andWithErrorMessage:(NSString *) errorMessage;

-(instancetype) initWithSuccess: (BOOL) isSuccess
            andWithErrorMessage:(NSString *) errorMessage;

+(Response *) successResponse;

+(Response *) errorResponseWithCode:(int) errorCode
                     andWithMessage: (NSString *) errorMessage;

+(Response *) errorResponseWithMessage: (NSString *) errorMessage;
@end
