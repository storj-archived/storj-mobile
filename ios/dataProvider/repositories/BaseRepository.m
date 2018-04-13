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
  if(self = [super init]) {
    _database = database;
  }
  
  return self;
}

-(Response *) executeInsertIntoTable:(NSString *)tableName
                            fromDict:(NSDictionary *)dictionary {
  NSArray * columns = [dictionary allKeys];
  NSString * request = [NSString  stringWithFormat:@"insert into %@ (%@) VALUES (%@)",
                        tableName,
                        [columns componentsJoinedByString:@","],
                        [[BaseRepository getDoubleDottedParametersArray:columns]
                         componentsJoinedByString:@","]];
  
  if([[self _database] open]) {
    //  NSLog(@"SQL Insert Request: %@ for %@", request, dictionary);
    if(![[self _database] executeUpdate:request withParameterDictionary:dictionary]) {
      
      return [self getResponseFromDatabaseError];
    }
    [_database close];
  } else {
    
    return [Response errorResponseWithMessage:@"Database cannot be oppened"];
  }
  
  return [Response successResponse];
}

-(Response *) executeDeleteFromTable:(NSString *)tableName
                       withObjectKey: (NSString *) objectKey
                    withObjecktValue: (NSString *) objectValue {
  NSString *request = [NSString stringWithFormat:@"DELETE FROM %@ WHERE %@ = ?",
                       tableName, objectKey];
  NSLog(@"SQL Delete Request: %@", request);
  if([[self _database] open]) {
    if(![[self _database] executeUpdate:request, objectValue]) {
      
      return [self getResponseFromDatabaseError];
    }
    [[self _database] close];
  } else {
    
    return [Response errorResponseWithMessage:@"Database cannot be oppened"];
  }
  
  return [Response successResponse];
}

-(Response *) executeDeleteFromTable:(NSString *)tableName
                       withObjectKey: (NSString *) objectKey
                    withObjecktIds: (NSArray *) objectIds {
  NSString *request = [NSString stringWithFormat:@"DELETE FROM %@ WHERE %@ IN (%@)",
                       tableName, objectKey, [[BaseRepository getEscapedValuesArray:objectIds]
                                              componentsJoinedByString:@","]];
  NSLog(@"SQL Delete Request: %@", request);
  if([[self _database] open]) {
    if(![[self _database] executeUpdate:request]) {
      
      return [self getResponseFromDatabaseError];
    }
    [[self _database] close];
  } else {
    
    return [Response errorResponseWithMessage:@"Database cannot be oppened"];
  }
  
  return [Response successResponse];
}

-(Response *) executeDeleteAllFromTable:(NSString *)tableName {
  NSString *request = [NSString stringWithFormat:@"DELETE FROM %@", tableName];
  if([[self _database] open]) {
    if(![[self _database] executeUpdate:request]) {
      
      return [self getResponseFromDatabaseError];
    }
    [[self _database] close];
  } else {
    
    return [Response errorResponseWithMessage:@"Database cannot be oppened"];
  }
  
  return [Response successResponse];
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
  if([[self _database] open]) {
    if(![[self _database] executeUpdate:request withParameterDictionary:updateDictionary]) {
      
      return [self getResponseFromDatabaseError];
    }
    [[self _database] close];
  } else {
    
    return [Response errorResponseWithMessage:@"Database cannot be oppened"];
  }
  
  return [Response successResponse];
}

-(Response *) getResponseFromDatabaseError {
  int errorCode = self._database.lastErrorCode;
  NSString *errorMessage = self._database.lastErrorMessage;
  NSLog(@"Last error: %d - %@", errorCode, errorMessage);
  [_database close];
  
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
