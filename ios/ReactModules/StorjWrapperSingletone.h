//
//  StorjWrapperSingletone.h
//  StorjMobile
//
//  Created by Barterio on 3/28/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
@import StorjIOS;

@interface StorjWrapperSingletone : NSObject{
  StorjWrapper *storjWrapper;
}
@property (nonatomic, retain, getter=storjWrapper) StorjWrapper *_storjWrapper;

+(id)sharedStorjWrapper;

@end
