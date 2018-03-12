//
//  DatabaseFactory.m
//  StorjMobile
//
//  Created by Barterio on 3/12/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "DatabaseFactory.h"

static DatabaseFactory *sharedInstance = nil;
static sqlite3 *database = nil;
static sqlite3_stmt *statement = nil;

@implementation DatabaseFactory
+(DatabaseFactory *)getSharedDatabaseFactory{
  if(!sharedInstance){
    sharedInstance = [[super allocWithZone:NULL]init];
    [sharedInstance createDatabase];
  }
  return sharedInstance;
}

-(BOOL)createDatabase{
  NSString *docsDir;
  NSArray *dirPaths;
  
  dirPaths = NSSearchPathForDirectoriesInDomains
  (NSDocumentDirectory, NSUserDomainMask, YES);
  docsDir = dirPaths[0];
  
  databasePath = [[NSString alloc] initWithString:
                  [docsDir stringByAppendingPathComponent: @DATABASE_NAME]];
  BOOL isSuccess = YES;
  NSFileManager *filemgr = [NSFileManager defaultManager];
  
  if ([filemgr fileExistsAtPath: databasePath ] == NO) {
    const char *dbpath = [databasePath UTF8String];
    if (sqlite3_open(dbpath, &database) == SQLITE_OK) {
      char *errMsg;
      
      if (sqlite3_exec(database, "CREATE TABLE STATEMENT1 FROM CONTRACTS", NULL, NULL, &errMsg) != SQLITE_OK) {
        isSuccess = NO;
        NSLog(@"Failed to create table");
      }
      
      if (sqlite3_exec(database, "CREATE TABLE STATEMENT2 FROM CONTRACTS", NULL, NULL, &errMsg) != SQLITE_OK) {
        isSuccess = NO;
        NSLog(@"Failed to create table");
      }
      
      sqlite3_close(database);
      return  isSuccess;
    } else {
      isSuccess = NO;
      NSLog(@"Failed to open/create database");
    }
  }
  return isSuccess;
}

-(BOOL) saveData:(NSString *)tableName andDictionary:(NSDictionary *)data{
  const char *dbpath = [databasePath UTF8String];
  
  if (sqlite3_open(dbpath, &database) == SQLITE_OK) {
    NSString *insertSQL = [NSString stringWithFormat: @"insert into table_name \
                           (field1, field2, field3, field4) \
                           values (\"%d\", \"%@\", \"%@\",\"%@\")",
                           6, @"field2Value", @"field3Value", @"field4Value"];
    const char *insert_stmt = [insertSQL UTF8String];
    sqlite3_prepare_v2(database, insert_stmt,-1, &statement, NULL);
    
    int sqliteStatus = sqlite3_step(statement);
    sqlite3_reset(statement);
    return sqliteStatus == SQLITE_DONE;
  }
  return NO;
}

//For single object
-(NSDictionary *) getData{
  const char *dbpath = [databasePath UTF8String];
  
  if (sqlite3_open(dbpath, &database) == SQLITE_OK) {
    NSString *querySQL = [NSString stringWithFormat:@"select * from TABLE_NAME where field1=\"%@\"",@"someData"];
    const char *query_stmt = [querySQL UTF8String];
    NSMutableDictionary *result = [[NSMutableDictionary alloc]init];
    
    if (sqlite3_prepare_v2(database,
                           query_stmt, -1, &statement, NULL) == SQLITE_OK) {
      if (sqlite3_step(statement) == SQLITE_ROW) {
        
        NSString *field1 = [[NSString alloc] initWithUTF8String:
                          (const char *) sqlite3_column_text(statement, 0)];
        [result setObject:field1 forKey:@"KEY_FIELD_1"];
        NSString *field2 = [[NSString alloc] initWithUTF8String:
                                (const char *) sqlite3_column_text(statement, 1)];
        [result setObject:field2 forKey:@"KEY_FIELD_2"];
        NSString *field3 = [[NSString alloc]initWithUTF8String:
                          (const char *) sqlite3_column_text(statement, 2)];
        [result setObject:field3 forKey:@"KEY_FIELD_3"];
        sqlite3_reset(statement);
        return result;
      } else {
        NSLog(@"Not found");
        sqlite3_reset(statement);
        return nil;
      }
    }
  }
  return nil;
}



@end
