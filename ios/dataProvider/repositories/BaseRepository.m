//
//  BaseRepository.m
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "BaseRepository.h"

@implementation BaseRepository
@synthesize _database;

-(instancetype) initWithDB:(FMDatabase *)database
{
  if(self = [super init]){
    _database = database;
  }
  return self;
}

-(Response *) executeInsertIntoTable:(NSString *)tableName
                            fromDict:(NSDictionary *)dictionary
{
  NSArray * columns = [dictionary allKeys];
  NSString * request = [NSString  stringWithFormat:@"insert into %@ (%@) VALUES (%@)",
                        tableName,
                        [columns componentsJoinedByString:@","],
                        [[BaseRepository getDoubleDottedParametersArray:columns]
                         componentsJoinedByString:@","]];
  NSLog(@"SQL Insert Request: %@ for %@", request, dictionary);
  if(![_database executeUpdate:request withParameterDictionary:dictionary]){
    return [self getResponseFromDatabaseError];
  }
  return [[Response alloc] initWithSuccess:YES andWithError:nil];
}

-(Response *) executeDeleteFromTable:(NSString *)tableName
                       withObjectKey: (NSString *) objectKey
                    withObjecktValue: (NSString *) objectValue
{
  NSString *request = [NSString stringWithFormat:@"DELETE FROM %@ WHERE %@ = '%@'",
                       tableName, objectKey, objectValue];
  NSLog(@"SQL Delete Request: %@", request);
  if(![_database executeUpdate:request]){
    return [self getResponseFromDatabaseError];
  }
  
  return [[Response alloc] initWithSuccess:YES andWithError: nil];
}

-(Response *) executeDeleteFromTable:(NSString *)tableName
                       withObjectKey: (NSString *) objectKey
                    withObjecktIds: (NSArray *) objectIds
{
  NSString *request = [NSString stringWithFormat:@"DELETE FROM %@ WHERE %@ IN (%@)",
                       tableName, objectKey, [[BaseRepository getEscapedValuesArray:objectIds]
                                              componentsJoinedByString:@","]];
  NSLog(@"SQL Delete Request: %@", request);
  if(![_database executeUpdate:request]){
    return [self getResponseFromDatabaseError];
  }
  
  return [[Response alloc] initWithSuccess:YES andWithError: nil];
}

-(Response *) executeDeleteAllFromTable:(NSString *)tableName
{
  NSString *request = [NSString stringWithFormat:@"DELETE FROM %@", tableName];
  if(![_database executeUpdate:request]){
    return [self getResponseFromDatabaseError];
  }
  return [[Response alloc] initWithSuccess:YES andWithError:nil];
}

-(Response *) executeUpdateAtTable:(NSString *) tableName
                         objectKey:(NSString *) objectKey
                          objectId:(NSString *) objectId
//                 columnsDictionary:(NSDictionary *) columnsDictionary
                  updateDictionary:(NSDictionary *) updateDictionary
{
  
  NSArray *columns = [updateDictionary allKeys];
  NSString *request = [NSString stringWithFormat:@"UPDATE %@ SET %@ WHERE %@ = '%@'",
                       tableName, [[BaseRepository getUpdateParametersArray:columns]
                                   componentsJoinedByString:@","],
                       objectKey,
                       objectId];
  NSLog(@"SQL Update Request: %@", request);
  if(![_database executeUpdate:request withParameterDictionary:updateDictionary]){
    return [self getResponseFromDatabaseError];
  }
  return [[Response alloc] initWithSuccess:YES andWithError:nil];
}

-(Response *) getResponseFromDatabaseError{
  NSLog(@"Last error: %@ - %@", self._database.lastError,
        self._database.lastErrorMessage);
  return [[Response alloc] initWithSuccess:NO
                             withErrorCode:self._database.lastErrorCode
                       andWithErrorMessage:self._database.lastErrorMessage];
}

+(NSArray *) getUpdateParametersArray:(NSArray *) array{
  NSMutableArray * result = [NSMutableArray array];
  for (NSString *key in array) {
    [result addObject:[NSString stringWithFormat:@"%@ = :%@", key, key]];
  }
  return result;
}

+(NSArray *) getDoubleDottedParametersArray:(NSArray *) array {
  NSMutableArray * result = [NSMutableArray array];
  for (NSString *key in array) {
    [result addObject:[NSString stringWithFormat:@":%@", key]];
  }
  return result;
}

+(NSArray *) getEscapedValuesArray:(NSArray *) array {
  NSMutableArray * result = [NSMutableArray array];
  for (NSString * value in array) {
    [result addObject:[NSString stringWithFormat:@"'%@'", value]];
  }
  return result;
}

@end
