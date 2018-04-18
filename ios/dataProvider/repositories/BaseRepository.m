//
//  BaseRepository.m
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "BaseRepository.h"
#import "DatabaseFactory.h"
@implementation BaseRepository
@synthesize _database;


-(instancetype) initWithDB:(FMDatabase *)database
{
  if(self = [super init]) {
    _database = database;
  }
  
  return self;
}

-(FMDatabaseQueue *)readableQueue {
  static NSString *dbPath;
  static dispatch_once_t onceToken;
  static FMDatabaseQueue *queue;
  dispatch_once(&onceToken, ^{
    dbPath = [[DatabaseFactory getSharedDatabaseFactory] getDBPath];
    queue =[FMDatabaseQueue databaseQueueWithPath: dbPath
                                            flags:SQLITE_OPEN_READONLY];
  });
//  NSLog(@"dbPath: %@", dbPath);
  
  return queue;
}

-(FMDatabaseQueue *)writableQueue {
  static NSString *dbPath;
  static dispatch_once_t onceToken;
  static FMDatabaseQueue *queue;
  dispatch_once(&onceToken, ^{
    dbPath =[[DatabaseFactory getSharedDatabaseFactory] getDBPath];
    queue =[FMDatabaseQueue databaseQueueWithPath:dbPath
                                            flags:SQLITE_OPEN_READWRITE];
  });
//  NSLog(@"dbPath: %@", dbPath);
  
  return queue;
}

-(Response *) executeInsertIntoTable:(NSString *)tableName
                            fromDict:(NSDictionary *)dictionary {
  NSArray * columns = [dictionary allKeys];
  NSString * request = [NSString  stringWithFormat:@"insert into %@ (%@) VALUES (%@)",
                        tableName,
                        [columns componentsJoinedByString:@","],
                        [[BaseRepository getDoubleDottedParametersArray:columns]
                         componentsJoinedByString:@","]];
  __block Response *response;
  FMDatabaseQueue *queue = [self writableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    if(![db executeUpdate:request withParameterDictionary:dictionary]) {
      response = [self getResponseFromDatabaseError:db];
    } else {
      response = [Response successResponse];
    }
  }];
  [queue close];
  return response;
}

-(Response *) executeDeleteFromTable:(NSString *)tableName
                       withObjectKey: (NSString *) objectKey
                    withObjecktValue: (NSString *) objectValue {
  NSString *request = [NSString stringWithFormat:@"DELETE FROM %@ WHERE %@ = ?",
                       tableName, objectKey];
  NSLog(@"SQL Delete Request: %@, %@ = %@", request, objectKey, objectValue);
  __block Response *response;
  FMDatabaseQueue *queue = [self writableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    if(![db executeUpdate:request, objectValue]) {
      response = [self getResponseFromDatabaseError:db];
    } else {
      response = [Response successResponse];
    }
  }];
  [queue close];
  return response;
}

-(Response *) executeDeleteFromTable:(NSString *)tableName
                       withObjectKey: (NSString *) objectKey
                    withObjecktIds: (NSArray *) objectIds {
  NSString *request = [NSString stringWithFormat:@"DELETE FROM %@ WHERE %@ IN (%@)",
                       tableName, objectKey, [[BaseRepository getEscapedValuesArray:objectIds]
                                              componentsJoinedByString:@","]];
  NSLog(@"SQL Delete Request: %@", request);
  __block Response *response;
  FMDatabaseQueue *queue = [self writableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    if(![db executeUpdate:request]) {
      response = [self getResponseFromDatabaseError:db];
    } else {
      response = [Response successResponse];
    }
  }];
  [queue close];
  return response;
}

-(Response *) executeDeleteAllFromTable:(NSString *)tableName {
  NSString *request = [NSString stringWithFormat:@"DELETE FROM %@", tableName];
  __block Response *response;
  FMDatabaseQueue *queue = [self writableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    if(![db executeUpdate:request]) {
      response = [self getResponseFromDatabaseError:db];
    } else {
      response = [Response successResponse];
    }
  }];
  [queue close];
  return response;
}

-(Response *) executeUpdateAtTable:(NSString *) tableName
                         objectKey:(NSString *) objectKey
                          objectId:(NSString *) objectId
//                 columnsDictionary:(NSDictionary *) columnsDictionary
                  updateDictionary:(NSDictionary *) updateDictionary {
  NSArray *columns = [updateDictionary allKeys];
  NSString *request = [NSString stringWithFormat:@"UPDATE %@ SET %@ WHERE %@ = '%@'",
                       tableName, [[BaseRepository getUpdateParametersArray:columns]
                                   componentsJoinedByString:@","],
                       objectKey,
                       objectId];
  NSLog(@"SQL Update Request: %@", request);
  __block Response *response;
  FMDatabaseQueue *queue = [self writableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    if(![db executeUpdate:request withParameterDictionary:updateDictionary]) {
      response = [self getResponseFromDatabaseError:db];
    } else {
      response = [Response successResponse];
    }
  }];
  [queue close];
  return response;
}

-(Response *) getResponseFromDatabaseError:(FMDatabase *)db {
  int errorCode = db.lastErrorCode;
  NSString *errorMessage = db.lastErrorMessage;
  NSLog(@"Last error: %d - %@", errorCode, errorMessage);
  
  return [[Response alloc] initWithSuccess:NO
                             withErrorCode:errorCode
                       andWithErrorMessage:errorMessage];
}

+(NSArray *) getUpdateParametersArray:(NSArray *) array {
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
