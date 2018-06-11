//
//  SyncQueueRepository.m
//  StorjMobile
//
//  Created by Developer Mac on 31.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "SyncQueueRepository.h"
#import "Response.h"
#import "SynchronizationQueueContract.h"

typedef void (^getCallback)(FMResultSet *resultSet);

@implementation SyncQueueRepository

static NSArray * columns;

-(instancetype) init
{
  return [super init];
}

-(NSArray *) getAll
{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@",
                      @"*",
                       SynchronizationQueueContract.TABLE_NAME];
  
  return [self getArrayWithRequest:(NSString *) request];
}

-(SyncQueueEntryModel *) getById: (int) _id
{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       @"*",
                       SynchronizationQueueContract.TABLE_NAME,
                       SynchronizationQueueContract.ID];
  NSArray *params = @[@(_id)];
  
  return [self getSingleModelWithRequest: (NSString *) request params: (NSArray *) params];
}

-(SyncQueueEntryModel *) getByLocalPath: (NSString *) localPath bucketId: (NSString *) bucketId
{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ? AND %@ = ?",
                       @"*",
                       SynchronizationQueueContract.TABLE_NAME,
                       SynchronizationQueueContract.LOCAL_PATH,
                       SynchronizationQueueContract.BUCKET_ID];
  NSArray *params = @[localPath, bucketId];
  
  return [self getSingleModelWithRequest: (NSString *) request params: (NSArray *) params];
}

-(Response *) insertWithModel: (SyncQueueEntryModel *) model
{
  if(!model || ![model isValid])
  {
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }

  Response *result = [super executeInsertIntoTable:SynchronizationQueueContract.TABLE_NAME
                                          fromDict: [SyncQueueRepository getUpdateDictionaryFromModel: (SyncQueueEntryModel *) model]];
  
  return result;
}

-(Response *) updateWithModel: (SyncQueueEntryModel *) model
{
  if(!model || ![model isValid])
  {
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  Response *result = [super executeUpdateAtTable:(NSString *) SynchronizationQueueContract.TABLE_NAME
                                      objectKey:(NSString *) SynchronizationQueueContract.ID
                                       objectId:(NSString *) [@(model._id) stringValue]
                               updateDictionary:(NSDictionary *) [SyncQueueRepository getUpdateDictionaryFromModel: (SyncQueueEntryModel *) model]];
  
  return result;
}

-(Response *) deleteById: (int) _id
{
  return [super executeDeleteFromTable:SynchronizationQueueContract.TABLE_NAME
                         withObjectKey:SynchronizationQueueContract.ID
                      withObjecktValue:[@(_id) stringValue]];
}

+(NSDictionary *) getUpdateDictionaryFromModel: (SyncQueueEntryModel *) model
{
  NSDictionary* dict = [model toDictionary];
  
  __block NSMutableArray<NSString *> * array = [NSMutableArray arrayWithCapacity:(NSUInteger) [dict count] - 2];
  
  [dict keysOfEntriesPassingTest:
                        ^BOOL(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
    if(
       (NSString *) key == SynchronizationQueueContract.ID
       || (NSString *) key == SynchronizationQueueContract.CREATION_DATE)
    {
      return NO;
    }
    
    [array addObject:(NSString *) key];
    return YES;
  }];
  
  NSDictionary *result = [dict dictionaryWithValuesForKeys:array];
  
  return result;
}

-(SyncQueueEntryModel *) getSingleModelWithRequest: (NSString *) request params: (NSArray *) params
{
  __block SyncQueueEntryModel *model = nil;
  
  getCallback callback = ^(FMResultSet *resultSet)
  {
    if([resultSet next])
    {
      SyncQueueEntryDbo *dbo = [SyncQueueRepository getSyncEntryDboFromResultSet: (FMResultSet *) resultSet];
      
      if(dbo)
      {
        model = [[SyncQueueEntryModel alloc] initWithDbo:(SyncQueueEntryDbo *) dbo];
      }
    }
  };
  
  [self executeWithCallback: (getCallback) callback request: (NSString *) request withParams: (NSArray *) params];
  return model;
}

-(SyncQueueEntryModel *) getSingleModelWithRequest: (NSString *) request
{
  return [self getSingleModelWithRequest:(NSString *) request params:(NSArray *) [NSArray array]];
}

-(NSArray *) getArrayWithRequest: (NSString *) request params: (NSArray *) params
{
  __block NSMutableArray<SyncQueueEntryModel *> *syncQueue = [NSMutableArray<SyncQueueEntryModel *> array];
  
  getCallback callback = ^(FMResultSet *resultSet)
  {
    while ([resultSet next])
    {
      SyncQueueEntryDbo *dbo = [SyncQueueRepository getSyncEntryDboFromResultSet: (FMResultSet *) resultSet];
      
      if(dbo)
      {
        [syncQueue addObject: [[SyncQueueEntryModel alloc] initWithDbo:(SyncQueueEntryDbo *) dbo]];
      }
    }
  };
  
  [self executeWithCallback: (getCallback) callback request:(NSString *) request withParams:(NSArray *) params];
  return syncQueue;
}

-(NSArray *) getArrayWithRequest: (NSString *) request
{
  return [self getArrayWithRequest:(NSString *) request params:(NSArray *) [NSArray array]];
}

-(void) executeWithCallback: (getCallback) callback request: (NSString *) request withParams: (NSArray *) params
{
  if(!params)
  {
    return;
  }
  
  FMDatabaseQueue *queue =[self readableQueue];
  [queue inDatabase: ^(FMDatabase * _Nonnull db)
  {
    FMResultSet * resultSet = [db executeQuery:request withArgumentsInArray:(NSArray *) params];
    
    if(!resultSet)
    {
      NSLog(@"No result set returned");
      return;
    }
    
    callback(resultSet);
    [resultSet close];
  }];
  
  [queue close];
}

+(NSArray *) getSelectionColumnString
{
  if(!columns)
  {
    NSMutableArray *colArray = [NSMutableArray array];
    [colArray addObject:SynchronizationQueueContract.ID];
    [colArray addObject:SynchronizationQueueContract.FILE_NAME];
    [colArray addObject:SynchronizationQueueContract.LOCAL_PATH];
    [colArray addObject:SynchronizationQueueContract.STATUS];
    [colArray addObject:SynchronizationQueueContract.ERROR_CODE];
    [colArray addObject:SynchronizationQueueContract.SIZE];
    [colArray addObject:SynchronizationQueueContract.COUNT];
    [colArray addObject:SynchronizationQueueContract.CREATION_DATE];
    [colArray addObject:SynchronizationQueueContract.BUCKET_ID];
    [colArray addObject:SynchronizationQueueContract.FILE_NAME];
    
    columns = [NSArray arrayWithArray:colArray];
  }
  
  return columns;
}

+(SyncQueueEntryDbo *) getSyncEntryDboFromResultSet:(FMResultSet *) resultSet
{
  SyncQueueEntryDbo * dbo = [[SyncQueueEntryDbo alloc ]
                             initWithId: [resultSet intForColumn: SynchronizationQueueContract.ID]
                             fileName: [resultSet stringForColumn: SynchronizationQueueContract.FILE_NAME]
                             localPath: [resultSet stringForColumn: SynchronizationQueueContract.LOCAL_PATH]
                             localIdentifier: [resultSet stringForColumn:SynchronizationQueueContract.LOCAL_IDENTIFIER]
                             status: [resultSet intForColumn: SynchronizationQueueContract.STATUS]
                             errorCode: [resultSet intForColumn: SynchronizationQueueContract.ERROR_CODE]
                             size: [resultSet longForColumn: SynchronizationQueueContract.SIZE]
                             count: [resultSet intForColumn: SynchronizationQueueContract.COUNT]
                             creationDate: [resultSet stringForColumn: SynchronizationQueueContract.CREATION_DATE]
                             bucketId: [resultSet stringForColumn: SynchronizationQueueContract.BUCKET_ID]
                             fileHandle: [resultSet longForColumn: SynchronizationQueueContract.FILE_HANDLE]];
  
  return dbo;
}

@end
