//
//  StorWrapperSingleton.h
//  StorjMobile
//
//  Created by Barterio on 3/28/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
@import StorjIOS;

@interface StorjWrapperSingleton : NSObject
@property (nonatomic, retain, getter=getStorjWrapper) StorjWrapper * _storjWrapper;

+(id)sharedStorjWrapper;
@end
