//
//  FilePickerLib.h
//  StorjMobile
//
//  Created by Barterio on 2/27/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <UIKit/UIKit.h>

@interface FilePickerLib : NSObject<RCTBridgeModule, UINavigationControllerDelegate,
                                    UIActionSheetDelegate, UIImagePickerControllerDelegate>

@end
