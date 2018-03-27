//
//  PromiseHandler.m
//  StorjMobile
//
//  Created by Barterio on 3/27/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "PromiseHandler.h"

@implementation PromiseHandler
@synthesize _resolver, _rejecter;

-(instancetype) initWithResolver: (RCTPromiseResolveBlock) resolver
                 andWithRejecter: (RCTPromiseRejectBlock) rejecter{
  
  if(self = [super init]){
    _resolver = resolver;
    _rejecter = rejecter;
  }
  return self;
}

-(instancetype) init{
  if(self = [super init]){
    _resolver = nil;
    _rejecter = nil;
  }
  return self;
}

-(void) resolveString: (NSString *) result{
  if(_resolver){
    _resolver(result);
    _resolver = nil;
  }
}

-(BOOL) isNil{
  return !_resolver && !_rejecter;
}

@end
