//
//  MethodHandler.h
//  StorjMobile
//
//  Created by Barterio on 3/26/18.
//  Copyright © 2018 Storj. All rights reserved.
//
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "BaseRepository.h"
#import "Response.h"

#define KEY_TASK_NAME "TaskName"

@interface MethodHandler : NSObject

//-(void) invoke
typedef void(^MethodHandlerCallbackBlock)(NSDictionary * _Nonnull param);

+(void) invokeWithParams: (NSDictionary *_Nonnull) params
   andMethodHandlerBlock: (MethodHandlerCallbackBlock _Nonnull ) callback;

+(void) invokeParallelWithParams: (NSDictionary *_Nonnull) params
    andMethodHandlerBlock: (MethodHandlerCallbackBlock _Nonnull) callback;

+(void) invokeBackgroundRemainWithParams :(NSDictionary *_Nonnull) params
                       methodHandlerBlock: (void(^ __nonnull)(NSDictionary *params,
                                                              UIBackgroundTaskIdentifier taskId)) callback
                        expirationHandler:(void(^ __nullable)(void)) expirationHandler;

@end
