//
//  SettingsRepository.h
//  StorjMobile
//
//  Created by Bohdan Artemenko on 5/31/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "BaseRepository.h"
#import "SettingsDbo.h"
#import "SettingsModel.h"

@interface SettingsRepository : BaseRepository

-(instancetype) init;

-(NSArray *) getAll;

-(SettingsDbo *) getById: (NSString *) settingsId;

-(Response *) update: (SettingsModel *) model;

-(Response *) updateById: (NSString *) settingId
              syncStatus: (BOOL) syncStatus;

-(Response *) updateById: (NSString *) settingId
            syncSettings: (int) syncSettings;

-(Response *) updateById: (NSString *) settingId
            syncSettings: (int) syncSettings
              firtSignIn: (BOOL) isFirstSignIn;

-(Response *) insertById: (NSString *) settingId;

-(Response *) insertByModel: (SettingsModel *) model;

@end
