//
//  StorjWrapperSingletone.m
//  StorjMobile
//
//  Created by Barterio on 3/28/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "StorjWrapperSingletone.h"

@implementation StorjWrapperSingletone

@synthesize _storjWrapper;

+(id)sharedStorjWrapper{
  static StorjWrapperSingletone *_sharedWrapper = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _sharedWrapper = [[self alloc] init];
  });
  return _sharedWrapper;
}

-(id) init{
  if(self = [super init]){
    _storjWrapper = [[StorjWrapper alloc] init];
  }
  return self;
}

@end
