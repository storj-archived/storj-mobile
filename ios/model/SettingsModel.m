//
//  SettingsModel.m
//  StorjMobile
//
//  Created by Bohdan Artemenko on 5/31/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "SettingsModel.h"
#import "DictionaryUtils.h"
#import "SettingsContract.h"

@implementation SettingsModel

-(instancetype) init
{
  return [super init];
}

-(instancetype) initWithSettingsId: (NSString *) settingsId
{
  return [self initWithSettingsId:settingsId
                      firstSignIn:NO
                       syncStatus:NO
                     syncSettings:0
                         lastSync:nil];
}

-(instancetype) initWithSettingsId: (NSString *) settingsId
                       firstSignIn: (BOOL) isFirstSignIn
                        syncStatus: (BOOL) syncStatus
                      syncSettings: (int) syncSettings
                          lastSync: (NSString *) lastSync
{
  if(self = [super init])
  {
    __id = settingsId;
    _isFirstSignIn = isFirstSignIn;
    _syncStatus = syncStatus;
    _syncSettings = syncSettings;
    _lastSync = lastSync;
  }
  
  return self;
}

- (NSDictionary *)toDictionary
{
  NSMutableDictionary *dictionary = [NSMutableDictionary dictionaryWithCapacity: 5];
  [dictionary setObject: [DictionaryUtils checkAndReturnNSString: __id]
                 forKey: SettingsContract.SETTINGS_ID];
  [dictionary setObject: @(_isFirstSignIn)
                 forKey: SettingsContract.FIRST_SIGN_IN];
  [dictionary setObject: @(_syncStatus)
                 forKey: SettingsContract.SYNC_STATUS];
  [dictionary setObject: @(_syncSettings)
                 forKey: SettingsContract.SYNC_SETTINGS];
  [dictionary setObject: [DictionaryUtils checkAndReturnNSString:_lastSync]
                 forKey: SettingsContract.LAST_SYNC];
  
  return dictionary;
}

@end
