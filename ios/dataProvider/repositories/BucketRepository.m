//
//  BucketRepository.m
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "BucketRepository.h"

@implementation BucketRepository
@synthesize _database;
static NSArray *columns;

-(instancetype) initWithDB:(FMDatabase *)database{
  if (self = [super initWithDB:database]){
    _database = database;
  }
  return self;
}

-(NSArray <BucketDbo *> *) getAll{
  NSLog(@"getAllBuckets");
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@",
                       [[BucketRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       BucketContract.TABLE_NAME];
  FMResultSet * resultSet = [[self _database] executeQuery:request];
//  [[self _database] ]
  if(!resultSet){
    NSLog( @"NO RESULT SET RETURNED");
    return nil;
  }
  NSMutableArray<BucketDbo *> * bucketDboArray = [NSMutableArray<BucketDbo *> array];
  
  while ([resultSet next]){
    BucketDbo * dbo = [BucketRepository getBucketDboFromResultSet:resultSet];
    if(dbo){
      [bucketDboArray addObject:dbo];
    }
  }
  [resultSet close];
  return bucketDboArray;
}

-(NSArray *) getAllWithOrderByColumn: (NSString *) columnName
                               order:(BOOL) isDescending{
  NSString *orderByColumn = columnName;
  if(!columnName || [columnName length] == 0){
    orderByColumn = BucketContract.CREATED;
  }
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ ORDER BY %@ %@",
                       [[BucketRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       BucketContract.TABLE_NAME,
                       orderByColumn,
                       isDescending ? @"DESC" : @"ASC"];
  FMResultSet * resultSet = [[self _database] executeQuery:request];
  if(!resultSet){
    return nil;
  }
  NSMutableArray<BucketDbo *> * bucketDboArray = [NSMutableArray<BucketDbo *> array];
  
  while ([resultSet next]){
    BucketDbo * dbo = [BucketRepository getBucketDboFromResultSet:resultSet];
    if(dbo){
      [bucketDboArray addObject:dbo];
    }
  }
  [resultSet close];
  return bucketDboArray;
}

-(NSArray *) getStarred{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[BucketRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       BucketContract.TABLE_NAME,
                       BucketContract.STARRED];
  FMResultSet * resultSet = [[self _database] executeQuery:request, 1];
  if(!resultSet){
    return nil;
  }
  NSMutableArray<BucketDbo *> * bucketDboArray = [NSMutableArray<BucketDbo *> array];
  
  while ([resultSet next]){
    BucketDbo * dbo = [BucketRepository getBucketDboFromResultSet:resultSet];
    if(dbo){
      [bucketDboArray addObject:dbo];
    }
  }
  [resultSet close];
  return bucketDboArray;
}

-(BucketDbo *) getByBucketId:(NSString *) bucketId{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[BucketRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       BucketContract.TABLE_NAME,
                       BucketContract.ID];
  FMResultSet * resultSet = [[self _database] executeQuery:request, bucketId];
  if(!resultSet){
    return nil;
  }
  [resultSet next];
  BucketDbo * dbo = [BucketRepository getBucketDboFromResultSet:resultSet];
  [resultSet close];
  return dbo;
}

-(BucketDbo *) getByColumnName:(NSString *) columnName
                   columnValue:(NSString *) columnValue{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       columnName,
                       BucketContract.TABLE_NAME,
                       columnName];
  FMResultSet * resultSet = [[self _database] executeQuery:request, columnValue];
  if(!resultSet){
    return nil;
  }
  [resultSet next];
  BucketDbo * dbo = [BucketRepository getBucketDboFromResultSet:resultSet];
  [resultSet close];
  return dbo;
}

-(Response *) insertWithModel: (BucketModel *) model{
//  NSLog(@"Model: %@", [model toDictionary]);
  if(!model || ![model isValid]){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  
  return [super executeInsertIntoTable:BucketContract.TABLE_NAME
                              fromDict:[[BucketDbo bucketDboFromBucketModel:model] toDictionary]];
}

-(Response *) deleteByModel: (BucketModel *) model{
  if(!model || ![model isValid]){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@""];
  }
  return [super executeDeleteFromTable:BucketContract.TABLE_NAME
                         withObjectKey:BucketContract.ID
                      withObjecktValue:[model _id]];
}

-(Response *) deleteById: (NSString *) bucketId{
  if(!bucketId || [bucketId length] == 0){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@""];
  }
  return [super executeDeleteFromTable:BucketContract.TABLE_NAME
                         withObjectKey:BucketContract.ID
                      withObjecktValue:bucketId];
}

-(Response *) deleteByIds: (NSArray *) bucketIds{
  if(!bucketIds || [bucketIds count] == 0){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@""];
  }
  return [super executeDeleteFromTable:BucketContract.TABLE_NAME
                         withObjectKey:BucketContract.ID
                        withObjecktIds:bucketIds];
}

-(Response *) deleteAll{
  return [super executeDeleteAllFromTable:BucketContract.TABLE_NAME];
}

-(Response *) updateByModel: (BucketModel *) model{
  if(!model || ![model isValid]){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@""];
  }
  
  return [super executeUpdateAtTable:BucketContract.TABLE_NAME
                           objectKey:BucketContract.ID
                            objectId:[model _id]
                    updateDictionary:[[BucketDbo bucketDboFromBucketModel:model]toDictionary]];
}

-(Response *) updateById:(NSString *)bucketId
                 starred:(BOOL) isStarred{
  if(!bucketId || [bucketId length] == 0){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@""];
  }
  return [super executeUpdateAtTable:BucketContract.TABLE_NAME
                           objectKey:BucketContract.ID
                            objectId:bucketId
                    updateDictionary:@{BucketContract.STARRED:@(isStarred)}];
}

+(BucketDbo *) getBucketDboFromResultSet:(FMResultSet *) resultSet{
  if(!resultSet){
    return nil;
  }
  return [[BucketDbo alloc] initWithId:[resultSet stringForColumn:BucketContract.ID]
                                  name:[resultSet stringForColumn:BucketContract.NAME]
                               created:[resultSet stringForColumn:BucketContract.CREATED]
                                  hash:[resultSet longForColumn:BucketContract.HASH_CODE]
                           isDecrypted:[resultSet boolForColumn:BucketContract.DECRYPTED]
                             isStarred:[resultSet boolForColumn:BucketContract.STARRED]];
}

+(NSArray *) getSelectionColumnsString{
  if(columns == nil){
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
