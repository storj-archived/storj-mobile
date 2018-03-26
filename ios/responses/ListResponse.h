//
//  ListResponse.h
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "Response.h"

@interface ListResponse : Response

@property (nonatomic, strong) NSArray * _result;


-(instancetype)initWithSuccess: (BOOL) isSuccess
                    withResult: (NSArray *) result
               andErrorMessage: (NSString *) errorMessage;

-(instancetype)initWithSuccess: (BOOL) isSuccess
                    withResult: (NSArray *) result
                 withErrorCode: (int)errorCode
               andErrorMessage: (NSString *) errorMessage;
@end
