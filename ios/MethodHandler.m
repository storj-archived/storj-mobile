//
//  MethodHandler.m
//  StorjMobile
//
//  Created by Barterio on 3/26/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "MethodHandler.h"



@implementation MethodHandler

+(void)invokeWithParams:(NSDictionary *)params
   andMethodHandlerBlock:(MethodHandlerCallbackBlock)callback{
  if(!callback){
    return;
  }
  
  callback(params);
}

+(void)invokeParallelWithParams:(NSDictionary *)params
           andMethodHandlerBlock:(MethodHandlerCallbackBlock)callback{
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
    [MethodHandler invokeWithParams:params andMethodHandlerBlock:callback];
  });
}

+(void)invokeBackgroundRemainWithParams:(NSDictionary *)params
                     methodHandlerBlock:(void (^)(NSDictionary *params,
                                                  UIBackgroundTaskIdentifier taskId))callback
                      expirationHandler:(void (^)(void))expirationHandler{
  if(!callback){
    return;
  }
  
  UIBackgroundTaskIdentifier bgTask = [[UIApplication sharedApplication]
                                       beginBackgroundTaskWithName:params[@KEY_TASK_NAME]
                                       expirationHandler : expirationHandler];
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
    callback(params, bgTask);
  });
  
}

@end
