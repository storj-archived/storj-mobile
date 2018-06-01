//
//  SettingsContract.h
//  StorjMobile
//
//  Created by Barterio on 5/31/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

@interface SettingsContract : NSObject

@property (readonly, class) NSString *const TABLE_NAME;

@property (readonly, class) NSString *const ID;
@property (readonly, class) NSString *const SETTINGS_ID;
@property (readonly, class) NSString *const FIRST_SIGN_IN;
@property (readonly, class) NSString *const SYNC_STATUS;
@property (readonly, class) NSString *const SYNC_SETTINGS;
@property (readonly, class) NSString *const LAST_SYNC;

+(NSString *) createTable;

@end
