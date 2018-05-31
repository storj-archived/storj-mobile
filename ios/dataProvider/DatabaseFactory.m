//
//  DatabaseFactory.m
//  StorjMobile
//
//  Created by Barterio on 3/12/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "DatabaseFactory.h"
#import "SettingsContract.h"

static DatabaseFactory *_sharedInstance = nil;
static FMDatabase * _database;

@implementation DatabaseFactory

+(DatabaseFactory *)getSharedDatabaseFactory {
  NSLog(@"%@", NSStringFromSelector(_cmd));
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    NSLog(@"Calling DB Init");
    _sharedInstance = [[self alloc] init];
  });
  NSLog(@"Returning shared instance of DB");
  
  return _sharedInstance;
}

-(id)init {
  if((self = [super init])) {
    NSLog(@"Initializing Database Factory");
    NSString *docsDir;
    NSArray *dirPaths;
    
    dirPaths = NSSearchPathForDirectoriesInDomains
    (NSDocumentDirectory, NSUserDomainMask, YES);
    docsDir = dirPaths[0];
    
    databasePath = [[NSString alloc] initWithString:
                    [docsDir stringByAppendingPathComponent: @DATABASE_NAME]];
    NSFileManager *filemgr = [NSFileManager defaultManager];
    BOOL isDbExisted = [filemgr fileExistsAtPath: databasePath];
    _database = [FMDatabase databaseWithPath:databasePath];
    
    if(!_database) {
      NSLog(@"DB can't be initialized");
      
      return nil;
    }
    
    if(!isDbExisted) {
      NSLog(@"Creating tables");
      [self createTables];
    } else {
      if(![self checkTablesExist]) {
        [self upgradeDatabase];
        NSLog(@"Updating DB. Drop and Create");
      }
    }
  }
  NSLog(@"DB Initialized");
  
  return self;
}

-(BOOL)createTables {
  BOOL isSuccess = YES;
  if(![_database open]) {
    NSLog(@"Database cannot be opened");
    
    isSuccess = NO;
  }
  if(![_database executeUpdate:[BucketContract createTable]]) {
    NSLog(@"Failed to create table \'%@\'", BucketContract.TABLE_NAME);
    
    isSuccess = NO;
  }
  
  if(![_database executeUpdate:[FileContract createTable]]) {
    NSLog(@"Failed to create table \'%@\'", FileContract.TABLE_NAME);
    
    isSuccess = NO;
  }
  
  if(![_database executeUpdate:[UploadFileContract createTable]]) {
    NSLog(@"Failed to create table \'%@\'", UploadFileContract.TABLE_NAME);
    
    isSuccess = NO;
  }
  
  if(![_database executeUpdate:[SynchronizationQueueContract createTable]]) {
    NSLog(@"Failed to create table \'%@\'", SynchronizationQueueContract.TABLE_NAME);
    
    isSuccess = NO;
  }
  
  if(![_database executeUpdate:[SettingsContract createTable]]) {
    NSLog(@"Failed to create table \'%@\'", SettingsContract.TABLE_NAME);
    
    isSuccess = NO;
  }
  NSLog(@"Tables Created");
  [_database close];
  
  return isSuccess;
}

-(BOOL) checkTablesExist {
  if(![_database open]) {
    NSLog(@"Database cannot be opened");
    
    return NO;
  }
  BOOL tablesExist =[_database tableExists:BucketContract.TABLE_NAME]
  || [_database tableExists:FileContract.TABLE_NAME]
  || [_database tableExists:UploadFileContract.TABLE_NAME]
  || [_database tableExists:SynchronizationQueueContract.TABLE_NAME]
  || [_database tableExists:SettingsContract.TABLE_NAME];
  
  [_database close];
  
  return tablesExist;
}

-(void) upgradeDatabase {
  [self dropTables];
  [self createTables];
}

-(void) dropTables {
  if(![_database open]) {
    NSLog(@"Database cannot be opened");
    
    return;
  }
  [_database executeUpdate:@"DROP TABLE IF EXISTS ?", BucketContract.TABLE_NAME];
  [_database executeUpdate:@"DROP TABLE IF EXISTS ?", FileContract.TABLE_NAME];
  [_database executeUpdate:@"DROP TABLE IF EXISTS ?", UploadFileContract.TABLE_NAME];
  [_database executeUpdate:@"DROP TABLE IF EXISTS ?", SynchronizationQueueContract.TABLE_NAME]
  [_database executeUpdate:@"DROP TABLE IF EXISTS ?", SettingsContract.TABLE_NAME];
  
  [_database close];
}

-(FMDatabase *) getSharedDb {
  
  return _database;
}

-(NSString *) getDBPath{
  return databasePath;
}

-(void)dealloc{
  if(_database){
    [_database close];
    _database = nil;
  }
}
@end
