//
//  SingleResponse.h
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "Response.h"

@interface SingleResponse : Response

@property (nonatomic, strong) NSString * _result;

-(instancetype)initWithSuccess: (BOOL) isSuccess
                    withResult: (NSString *) result
                      andErrorMessage: (NSString *) errorMessage;

-(instancetype)initWithSuccess: (BOOL) isSuccess
                    withResult: (NSString *) result
                 withErrorCode: (int)errorCode
               andErrorMessage: (NSString *) errorMessage;

+(SingleResponse *) successSingleResponseWithResult:(NSString *) result;

@end
