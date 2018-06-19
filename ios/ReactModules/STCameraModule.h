//
//  STCameraModule.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 5/10/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>
#import "SingleResponse.h"

@interface STCameraModule : NSObject<RCTBridgeModule, UIImagePickerControllerDelegate,
                                  UINavigationControllerDelegate>

@property (nonatomic, strong) NSString *_bucketId;

@end
