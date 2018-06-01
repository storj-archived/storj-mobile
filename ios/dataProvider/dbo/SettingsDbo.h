//
//  SettingsDbo.h
//  StorjMobile
//
//  Created by Barterio on 5/31/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
#import "SettingsContract.h"

@class SettingsModel;

@interface SettingsDbo : NSObject

@property (nonatomic, strong) NSString *_id;
@property BOOL isFirstSignIn;
@property BOOL syncStatus;
@property int syncSettings;
@property (nonatomic, strong) NSString * lastSync;

-(instancetype) initWithSettingsId: (NSString *) settingsId
                          lastSync: (NSString *) lastSync;

-(SettingsModel *) toModel;

@end
