//
//  SettingsContract.m
//  StorjMobile
//
//  Created by Barterio on 5/31/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "SettingsContract.h"

@implementation SettingsContract

static NSString *const _TABLE_NAME = @"settingsTable";
static NSString *const _ID = @"_id";

static NSString *const _SETTINGS_ID = @"settingsId";
static NSString *const _FIRST_SIGN_IN = @"isFirstSignIn";
static NSString *const _SYNC_STATUS = @"syncStatus";
static NSString *const _SYNC_SETTINGS = @"syncSettings";
static NSString *const _LAST_SYNC = @"lastSync";

+(NSString *) TABLE_NAME
{
  return _TABLE_NAME;
}

+(NSString *) ID
{
  return _ID;
}

+(NSString *) SETTINGS_ID
{
  return _SETTINGS_ID;
}

+(NSString *) FIRST_SIGN_IN
{
  return _FIRST_SIGN_IN;
}

+(NSString *) SYNC_STATUS
{
  return _SYNC_STATUS;
}

+(NSString *) SYNC_SETTINGS
{
  return _SYNC_SETTINGS;
}

+(NSString *) LAST_SYNC
{
  return _LAST_SYNC;
}

+(NSString *) createTable
{
  return [NSString stringWithFormat:@"create table if not exists %@ (\
%@ TEXT primary key not null, \
%@ NUMBER DEFAULT 1, \
%@ NUMBER DEFAULT 0, \
%@ NUMBER DEFAULT 0, \
%@ TIMESTAMP DEFAULT CURRENT_TIMESTAMP)", _TABLE_NAME, _ID, _FIRST_SIGN_IN, _SYNC_STATUS,
          _SYNC_SETTINGS, _LAST_SYNC];
}

@end
