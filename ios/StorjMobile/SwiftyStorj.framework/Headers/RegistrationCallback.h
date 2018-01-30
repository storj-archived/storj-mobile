//
//  RegistrationCallback.h
//  SwiftyStorj
//
//  Created by Barterio on 1/29/18.
//  Copyright © 2018 angu2111. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ErrorCallbackBlock.h"

typedef void(^OnSuccessCallbackBlock)(NSString * email);

@interface RegistrationCallback : NSObject

@property (nonatomic) OnSuccessCallbackBlock onSuccess;
@property (nonatomic) OnErrorCallback onError;

-(void)success:(NSString *)email;
-(void)error:(NSString *)message;

//-(void)release;
@end
