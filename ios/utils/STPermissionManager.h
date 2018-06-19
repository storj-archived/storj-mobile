//
//  STPermissionManager.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 6/8/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface STPermissionManager : NSObject

typedef void(^STPermissionCompletion)();

-(BOOL) isAllPermissionsGranted;

-(void) requestAllPermissionsWithCompletion: (STPermissionCompletion) completionHandle;

@end
