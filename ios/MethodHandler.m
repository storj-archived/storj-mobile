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

+(void)invokeBackgroundSyncRemainWithParams:(NSDictionary *)params
                         methodHandlerBlock:(void (^)(NSDictionary *, UIBackgroundTaskIdentifier))methodHandlerBlock
                          expirationHandler:(void (^)(void))expirationHandler {
  if(!methodHandlerBlock){
    return;
  }
  
  UIBackgroundTaskIdentifier bgTask = [[UIApplication sharedApplication]
                                       beginBackgroundTaskWithName:params[@KEY_TASK_NAME]
                                       expirationHandler : expirationHandler];
  
  dispatch_async([MethodHandler getSyncQueue], ^{
    methodHandlerBlock(params, bgTask);
  });
}

+(dispatch_queue_t) getSyncQueue {
  static dispatch_queue_t queue;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    queue = dispatch_queue_create("io.storj.app.background.serial", DISPATCH_QUEUE_SERIAL);
  });
  return queue;
}

@end
