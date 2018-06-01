//
//  SettingsRepository.m
//  StorjMobile
//
//  Created by Bohdan Artemenko on 5/31/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "SettingsRepository.h"
#import "FMResultSet.h"
#import "Response.h"

@implementation SettingsRepository

static NSArray *columns;

-(instancetype) init
{
  if(self = [super init]){}
  
  return self;
}

-(NSArray *) getAll
{
  NSString *request = [NSString stringWithFormat: @"SELECT %@ FROM %@",
                       [[SettingsRepository selectionColumn] componentsJoinedByString: @","],
                       SettingsContract.TABLE_NAME];
  
  __block NSMutableArray<SettingsDbo *> *dboArray = [NSMutableArray array];
  
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase: ^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery: request];
    if(!resultSet)
    {
      NSLog(@"No result set returned");
      
      return;
    }
    
    while([resultSet next])
    {
      SettingsDbo *dbo = [SettingsRepository dboFromResultSet: resultSet];
      if(dbo)
      {
        [dboArray addObject: dbo];
      }
    }
    [resultSet close];
  }];
  [queue close];
  
  return dboArray;
}

-(SettingsDbo *) getById: (NSString *) settingsId
{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[SettingsRepository selectionColumn] componentsJoinedByString:@","],
                       SettingsContract.TABLE_NAME,
                       SettingsContract.ID];
  __block SettingsDbo *dbo = nil;
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase: ^(FMDatabase * _Nonnull db)
   {
     FMResultSet * resultSet = [db executeQuery: request, settingsId];
     if(!resultSet)
     {
       NSLog(@"No result set returned");
       
       return;
     }
     
     if([resultSet next])
     {
       dbo = [SettingsRepository dboFromResultSet: resultSet];
     }
     [resultSet close];
   }];
  [queue close];
  
  return dbo;
}

-(Response *) update: (SettingsModel *) model
{
  if(!model)
  {
    return [Response errorResponseWithMessage:@"Model is not valid."];
  }
  
  return [super executeUpdateAtTable: SettingsContract.TABLE_NAME
                           objectKey: SettingsContract.ID
                            objectId: [model _id]
                    updateDictionary: [model toDictionary]];
}

-(Response *) updateById: (NSString *) settingId
              syncStatus: (BOOL) syncStatus
{
  if(!settingId || settingId.length == 0)
  {
    return [Response errorResponseWithMessage: @"Model is not valid"];
  }
  
  return [super executeUpdateAtTable: SettingsContract.TABLE_NAME
                           objectKey: SettingsContract.ID
                            objectId: settingId
                    updateDictionary: @{
                                        SettingsContract.ID : settingId,
                                        SettingsContract.SYNC_SETTINGS : @(syncStatus)
                                        }];
}

-(Response *) updateById: (NSString *) settingId
            syncSettings: (int) syncSettings
{
  if(!settingId || settingId.length == 0)
  {
    return [Response errorResponseWithMessage: @"Model is not valid"];
  }
  
  return [super executeUpdateAtTable: SettingsContract.TABLE_NAME
                           objectKey: SettingsContract.ID
                            objectId: settingId
                    updateDictionary: @{
                                        SettingsContract.ID : settingId,
                                        SettingsContract.SYNC_SETTINGS : @(syncSettings)
                                        }];
}

-(Response *) updateById: (NSString *) settingId
            syncSettings: (int) syncSettings
              firtSignIn: (BOOL) isFirstSignIn
{
  if(!settingId || settingId.length == 0)
  {
    return [Response errorResponseWithMessage: @"Model is not valid"];
  }
  
  return [super executeUpdateAtTable: SettingsContract.TABLE_NAME
                           objectKey: SettingsContract.ID
                            objectId: settingId
                    updateDictionary: @{
                                        SettingsContract.ID : settingId,
                                        SettingsContract.SYNC_SETTINGS : @(syncSettings),
                                        SettingsContract.FIRST_SIGN_IN : @(isFirstSignIn)
                                        }];
}

-(Response *) insertById: (NSString *) settingId
{
  if(!settingId || [settingId length] == 0)
  {
    return [Response errorResponseWithMessage: @"Model is not valid"];
  }
  
  return [super executeInsertIntoTable: SettingsContract.TABLE_NAME
                              fromDict: @{SettingsContract.ID : settingId}];
}

-(Response *) insertByModel: (SettingsModel *) model
{
  if(!model)
  {
    return [Response errorResponseWithMessage: @"Model is not valid"];
  }
  
  return [super executeInsertIntoTable: SettingsContract.TABLE_NAME
                              fromDict: [model toDictionary]];
}

+(SettingsDbo *) dboFromResultSet: (FMResultSet *) resultSet
{
  SettingsDbo *dbo = [[SettingsDbo alloc] init];
  
  [dbo set_id: [resultSet stringForColumn: SettingsContract.ID]];
  [dbo setIsFirstSignIn: [resultSet boolForColumn: SettingsContract.FIRST_SIGN_IN]];
  [dbo setSyncStatus: [resultSet boolForColumn: SettingsContract.SYNC_STATUS]];
  [dbo setSyncSettings: [resultSet intForColumn: SettingsContract.SYNC_SETTINGS]];
  [dbo setLastSync: [resultSet stringForColumn: SettingsContract.LAST_SYNC]];
  
  return dbo;
}

+(NSArray *) selectionColumn
{
  if(!columns)
  {
    NSMutableArray *colArray = [NSMutableArray arrayWithCapacity: 5];
    
    [colArray addObject: SettingsContract.ID];
    [colArray addObject: SettingsContract.FIRST_SIGN_IN];
    [colArray addObject: SettingsContract.SYNC_STATUS];
    [colArray addObject: SettingsContract.SYNC_SETTINGS];
    [colArray addObject: SettingsContract.LAST_SYNC];
    
    columns = [NSArray arrayWithArray: colArray];
  }
  
  return columns;
}

@end
