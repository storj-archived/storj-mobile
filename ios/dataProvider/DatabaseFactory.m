//
//  DatabaseFactory.m
//  StorjMobile
//
//  Created by Barterio on 3/12/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "DatabaseFactory.h"

static DatabaseFactory *_sharedInstance = nil;
static FMDatabase * _database;

@implementation DatabaseFactory
+(DatabaseFactory *)getSharedDatabaseFactory{
  if(!_sharedInstance){
    _sharedInstance = [[DatabaseFactory alloc] init];
  }
  return _sharedInstance;
}

-(id)init{
  if((self = [super init])){
    NSLog(@"Initializing Database Factory");
    NSString *docsDir;
    NSArray *dirPaths;
    
    dirPaths = NSSearchPathForDirectoriesInDomains
    (NSDocumentDirectory, NSUserDomainMask, YES);
    docsDir = dirPaths[0];
    
    databasePath = [[NSString alloc] initWithString:
                    [docsDir stringByAppendingPathComponent: @DATABASE_NAME]];
    NSFileManager *filemgr = [NSFileManager defaultManager];
    
    _database = [FMDatabase databaseWithPath:databasePath];
    
    BOOL isDbExisted = [filemgr fileExistsAtPath: databasePath];
      
    
    if(!_database){
      NSLog(@"DB can't be initialized");
      return nil;
    }
    if(![_database open]){
      NSLog(@"DB can't be openned");
      return nil;
    }
    
    if(!isDbExisted){
      NSLog(@"Creating tables");
      [self createTables];
    }
  }
  NSLog(@"DB Initialized");
  return self;
}

-(BOOL)createTables{
  BOOL isSuccess = YES;
  
  if(![_database executeUpdate:[BucketContract createTable]]){
    isSuccess = NO;
    NSLog(@"Failed to create table \'%@\'", BucketContract.TABLE_NAME);
  }
  
  if(![_database executeUpdate:[FileContract createTable]]){
    isSuccess = NO;
    NSLog(@"Failed to create table \'%@\'", FileContract.TABLE_NAME);
  }
  
  if(![_database executeUpdate:[UploadFileContract createTable]]){
    isSuccess = NO;
    NSLog(@"Failed to create table \'%@\'", UploadFileContract.TABLE_NAME);
  }
  return isSuccess;
}

-(void) upgradeDatabase{
  [self dropTables];
  [self createTables];
}

-(void) dropTables {
  [_database executeUpdate:@"DROP TABLE IF EXISTS ?", BucketContract.TABLE_NAME];
  [_database executeUpdate:@"DROP TABLE IF EXISTS ?", FileContract.TABLE_NAME];
  [_database executeUpdate:@"DROP TABLE IF EXISTS ?", UploadFileContract.TABLE_NAME];
}

-(FMDatabase *) getSharedDb{
  return _database;
}

-(void)dealloc{
  if(_database){
    [_database close];
    _database = nil;
  }
}
@end
