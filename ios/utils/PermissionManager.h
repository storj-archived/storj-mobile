//
//  PermissionManager.h
//  StorjMobile
//
//  Created by Barterio on 6/8/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PermissionManager : NSObject

typedef void(^STPermissionCompletion)();

-(BOOL) isAllPermissionsGranted;

-(void) requestAllPermissionsWithCompletion: (STPermissionCompletion) completionHandle;

@end
