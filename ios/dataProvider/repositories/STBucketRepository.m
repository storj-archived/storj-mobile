//
//  STBucketRepository.m
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STBucketRepository.h"

#import "BaseRepository.h"
#import "BucketContract.h"
#import "Response.h"

@implementation STBucketRepository

static NSArray *columns;

-(instancetype) init {
  if (self = [super init]) {}
  
  return self;
}

-(NSArray <BucketDbo *> *) getAll {
  NSLog(@"getAllBuckets");
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@",
                       [[STBucketRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       BucketContract.TABLE_NAME];
  __block NSMutableArray<BucketDbo *> * bucketDboArray = [NSMutableArray<BucketDbo *> array];
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request];
    
    if(!resultSet) {
      NSLog( @"No result set returned");
      return;
    }
    while ([resultSet next]) {
      BucketDbo * dbo = [STBucketRepository getBucketDboFromResultSet:resultSet];
      if(dbo) {
        [bucketDboArray addObject:dbo];
      }
    }
    [resultSet close];
  }];
  [queue close];
  return bucketDboArray;
}

-(NSArray *) getAllWithOrderByColumn: (NSString *) columnName
                               order:(BOOL) isDescending {
  NSString *orderByColumn = columnName;
  if(!columnName || [columnName length] == 0) {
    orderByColumn = BucketContract.CREATED;
  }
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ ORDER BY %@ COLLATE NOCASE %@",
                       [[STBucketRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       BucketContract.TABLE_NAME,
                       orderByColumn,
                       isDescending ? @"DESC" : @"ASC"];
  __block NSMutableArray<BucketDbo *> * bucketDboArray = [NSMutableArray array];
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request];
    if(!resultSet) {
      NSLog( @"No result set returned");
      bucketDboArray = nil;
    }
    while ([resultSet next]) {
      BucketDbo * dbo = [STBucketRepository getBucketDboFromResultSet:resultSet];
      if(dbo) {
        [bucketDboArray addObject:dbo];
      }
    }
    [resultSet close];
  }];
  [queue close];
  return bucketDboArray;
}

-(NSArray *) getStarred {
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[STBucketRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       BucketContract.TABLE_NAME,
                       BucketContract.STARRED];
  __block NSMutableArray<BucketDbo *> * bucketDboArray = [NSMutableArray<BucketDbo *> array];
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request, 1];
    if(!resultSet) {
      NSLog(@"No resultSet returned");
      return;
    }
    while ([resultSet next]) {
      BucketDbo * dbo = [STBucketRepository getBucketDboFromResultSet:resultSet];
      if(dbo) {
        [bucketDboArray addObject:dbo];
      }
    }
    [resultSet close];
  }];
  [queue close];
  
  return bucketDboArray;
}

-(BucketDbo *) getByBucketId:(NSString *) bucketId {
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[STBucketRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       BucketContract.TABLE_NAME,
                       BucketContract.ID];
  __block BucketDbo *dbo = nil;
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request, bucketId];
    if(!resultSet) {
      NSLog(@"No resultSet returned");
      return;
    }
    
    if([resultSet next]) {
      dbo = [STBucketRepository getBucketDboFromResultSet:resultSet];
    }
    [resultSet close];
  }];
  [queue close];
  return dbo;
}

-(BucketDbo *) getBucketByBucketName: (NSString *) bucketName
{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[STBucketRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       BucketContract.TABLE_NAME,
                       BucketContract.NAME];
  __block BucketDbo *dbo = nil;
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request, bucketName];
    if(!resultSet) {
      NSLog(@"No resultSet returned");
      return;
    }
    
    if([resultSet next]) {
      dbo = [STBucketRepository getBucketDboFromResultSet:resultSet];
    }
    [resultSet close];
  }];
  [queue close];
  return dbo;
}

-(BucketDbo *) getByColumnName:(NSString *) columnName
                   columnValue:(NSString *) columnValue {
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       columnName,
                       BucketContract.TABLE_NAME,
                       columnName];
  __block BucketDbo *dbo = nil;
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet *resultSet = [db executeQuery:request, columnValue];
    if(!resultSet) {
      NSLog(@"No resultSet returned");
      
      return;
    }
    
    if([resultSet next]) {
      dbo = [STBucketRepository getBucketDboFromResultSet:resultSet];
    }
    [resultSet close];
  }];
  [queue close];
  return dbo;
}

-(Response *) insertWithModel: (STBucketModel *) model {
  if(!model || ![model isValid]) {
    
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  
  return [super executeInsertIntoTable:BucketContract.TABLE_NAME
                              fromDict:[[BucketDbo bucketDboFromBucketModel:model] toDictionary]];
}

-(Response *) deleteByModel: (STBucketModel *) model {
  if(!model || ![model isValid]) {
    
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  return [super executeDeleteFromTable:BucketContract.TABLE_NAME
                         withObjectKey:BucketContract.ID
                      withObjecktValue:[model _id]];
}

-(Response *) deleteById: (NSString *) bucketId {
  
  if(!bucketId || [bucketId length] == 0) {
    
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  
  return [super executeDeleteFromTable:BucketContract.TABLE_NAME
                         withObjectKey:BucketContract.ID
                      withObjecktValue:bucketId];
}

-(Response *) deleteByIds: (NSArray *) bucketIds {
  if(!bucketIds || [bucketIds count] == 0) {
    
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  return [super executeDeleteFromTable:BucketContract.TABLE_NAME
                         withObjectKey:BucketContract.ID
                        withObjecktIds:bucketIds];
}

-(Response *) deleteAll {
  
  return [super executeDeleteAllFromTable:BucketContract.TABLE_NAME];
}

-(Response *) updateByModel: (STBucketModel *) model {
  if(!model || ![model isValid]) {
    
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  
  return [super executeUpdateAtTable:BucketContract.TABLE_NAME
                           objectKey:BucketContract.ID
                            objectId:[model _id]
                    updateDictionary:[[BucketDbo bucketDboFromBucketModel:model]toDictionary]];
}

-(Response *) updateById:(NSString *)bucketId
                 starred:(BOOL) isStarred {
  
  if(!bucketId || [bucketId length] == 0) {
    
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  
  return [super executeUpdateAtTable:BucketContract.TABLE_NAME
                           objectKey:BucketContract.ID
                            objectId:bucketId
                    updateDictionary:@{BucketContract.STARRED:@(isStarred)}];
}

+(BucketDbo *) getBucketDboFromResultSet:(FMResultSet *) resultSet {
  if(!resultSet) {
    
    return nil;
  }
  
  return [[BucketDbo alloc] initWithId:[resultSet stringForColumn:BucketContract.ID]
                                  name:[resultSet stringForColumn:BucketContract.NAME]
                               created:[resultSet stringForColumn:BucketContract.CREATED]
                                  hash:[resultSet longForColumn:BucketContract.HASH_CODE]
                           isDecrypted:[resultSet boolForColumn:BucketContract.DECRYPTED]
                             isStarred:[resultSet boolForColumn:BucketContract.STARRED]];
}

+(NSArray *) getSelectionColumnsString {
  if(columns == nil) {
    NSMutableArray *colArray = [NSMutableArray array];
    [colArray addObject:BucketContract.ID];
    [colArray addObject:BucketContract.NAME];
    [colArray addObject:BucketContract.CREATED];
    [colArray addObject:BucketContract.HASH_CODE];
    [colArray addObject:BucketContract.DECRYPTED];
    [colArray addObject:BucketContract.STARRED];
    columns = [NSArray arrayWithArray:colArray];
  }
  
  return columns;
}
@end
