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
    //additional options
  }
  return self;
}

-(NSArray <BucketDbo *> *) getAll{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@",
                       [[BucketRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       BucketContract.TABLE_NAME];
  FMResultSet * resultSet = [_database executeQuery:request];
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
  FMResultSet * resultSet = [_database executeQuery:request];
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
  FMResultSet * resultSet = [_database executeQuery:request, 1];
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
  FMResultSet * resultSet = [_database executeQuery:request, bucketId];
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
  FMResultSet * resultSet = [_database executeQuery:request, columnValue];
  if(!resultSet){
    return nil;
  }
  [resultSet next];
  BucketDbo * dbo = [BucketRepository getBucketDboFromResultSet:resultSet];
  [resultSet close];
  return dbo;
}

-(Response *) insertWithModel: (BucketModel *) model{
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
  BucketDbo * dbo = [[BucketDbo alloc]init];
  if(!resultSet){
    return dbo;
  }
  [dbo setProp:BucketContract.ID fromString:[resultSet stringForColumn:BucketContract.ID]];
  [dbo setProp:BucketContract.NAME fromString:[resultSet stringForColumn:BucketContract.NAME]];
  [dbo setProp:BucketContract.CREATED fromString:[resultSet stringForColumn:BucketContract.CREATED]];
  [dbo setProp:BucketContract.HASH_CODE fromLong:[resultSet longForColumn:BucketContract.HASH_CODE]];
  [dbo setProp:BucketContract.DECRYPTED fromBool:[resultSet boolForColumn:BucketContract.DECRYPTED]];
  [dbo setProp:BucketContract.STARRED fromBool:[resultSet boolForColumn:BucketContract.STARRED]];
  return dbo;
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
