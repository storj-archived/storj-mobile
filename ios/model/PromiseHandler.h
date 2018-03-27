//
//  PromiseHandler.h
//  StorjMobile
//
//  Created by Barterio on 3/27/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface PromiseHandler : NSObject

@property (nonatomic, strong, getter=resolver) RCTPromiseResolveBlock _resolver;
@property (nonatomic, strong, getter=rejecter) RCTPromiseRejectBlock _rejecter;

-(instancetype) initWithResolver: (RCTPromiseResolveBlock) resolver
                 andWithRejecter: (RCTPromiseRejectBlock) rejecter;

-(instancetype) init;

-(void) resolveString: (NSString *) result;

-(BOOL) isNil;

@end
