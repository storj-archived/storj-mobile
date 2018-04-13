//
//  FileRepository.m
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "FileRepository.h"
#import "FileDbo.h"
#import "FileModel.h"
#import "FileContract.h"

@implementation FileRepository
@synthesize _database;
static NSArray * columns;

-(instancetype) initWithDB:(FMDatabase *)database{
  if (self = [super initWithDB:database]){
    _database = database;
  }
  return self;
}

-(NSArray *) getAll{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@",
                       [[FileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       FileContract.TABLE_NAME];
  FMResultSet * resultSet = [[self _database] executeQuery:request];
  if(!resultSet){
    return nil;
  }
  NSMutableArray<FileDbo *> * fileDboArray = [NSMutableArray<FileDbo *> array];
  
  while ([resultSet next]){
    FileDbo * dbo = [FileRepository getFileDboFromResultSet:resultSet];
    if(dbo){
      [fileDboArray addObject:dbo];
    }
  }
  [resultSet close];
  return fileDboArray;
}

-(NSArray *) getAllFromBucket:(NSString *)bucketId{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[FileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       FileContract.TABLE_NAME,
                       FileContract.FILE_FK];
  FMResultSet *resultSet = [[self _database] executeQuery:request, bucketId];
  if(!resultSet) {
    return nil;
  }
  NSMutableArray <FileDbo *> * fileDboArray = [NSMutableArray <FileDbo *> array];
  
  while([resultSet next]){
    FileDbo *dbo = [FileRepository getFileDboFromResultSet:resultSet];
    if(dbo){
      [fileDboArray addObject:dbo];
    }
  }
  [resultSet close];
  NSLog(@"getAllFromBucket.Count: %lu", (unsigned long)fileDboArray.count);
  return fileDboArray;
}

-(NSArray *) getAllWithOrderByColumn: (NSString *) columnName
                               order:(BOOL) isDescending{
  NSString *orderByColumn = columnName;
  if(!columnName || [columnName length] == 0){
    orderByColumn = FileContract.CREATED;
  }
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ ORDER BY %@ %@",
                       [[FileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       FileContract.TABLE_NAME,
                       orderByColumn,
                       isDescending ? @"DESC" : @"ASC"];
  FMResultSet * resultSet = [[self _database] executeQuery:request];
  if(!resultSet){
    return nil;
  }
  NSMutableArray<FileDbo *> * fileDboArray = [NSMutableArray<FileDbo *> array];
  
  while ([resultSet next]){
    FileDbo * dbo = [FileRepository getFileDboFromResultSet:resultSet];
    if(dbo){
      [fileDboArray addObject:dbo];
    }
  }
  [resultSet close];
  return fileDboArray;
}

-(NSArray *) getStarred{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[FileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       FileContract.TABLE_NAME,
                       FileContract.STARRED];
  FMResultSet * resultSet = [[self _database] executeQuery:request, 1];
  if(!resultSet){
    return nil;
  }
  NSMutableArray<FileDbo *> * fileDboArray = [NSMutableArray<FileDbo *> array];
  
  while ([resultSet next]){
    FileDbo * dbo = [FileRepository getFileDboFromResultSet:resultSet];
    if(dbo){
      [fileDboArray addObject:dbo];
    }
  }
  [resultSet close];
  return fileDboArray;
}

-(FileDbo *) getByFileId:(NSString *) fileId{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[FileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       FileContract.TABLE_NAME,
                       FileContract.FILE_ID];
  FMResultSet * resultSet = [[self _database] executeQuery:request, fileId];
  if(!resultSet){
    return nil;
  }
  FileDbo * dbo = nil;
  if([resultSet next]){
    dbo = [FileRepository getFileDboFromResultSet:resultSet];
  }
  [resultSet close];
  return dbo;
}

-(FileDbo *) getByColumnName:(NSString *) columnName
                 columnValue:(NSString *) columnValue{
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       columnName,
                       FileContract.TABLE_NAME,
                       columnName];
  FMResultSet * resultSet = [[self _database] executeQuery:request, columnValue];
  if(!resultSet){
    return nil;
  }
  [resultSet next];
  FileDbo * dbo = [FileRepository getFileDboFromResultSet:resultSet];
  [resultSet close];
  return dbo;
}

-(Response *) insertWithModel: (FileModel *) model{
  if(!model || ![model isValid]){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  return [super executeInsertIntoTable:FileContract.TABLE_NAME
                              fromDict:[[FileDbo fileDboFromFileModel:model] toDictionary]];
}

-(Response *) deleteByModel: (FileModel *) model{
  if(!model || ![model isValid]){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  return [super executeDeleteFromTable:FileContract.TABLE_NAME
                         withObjectKey:FileContract.FILE_ID
                      withObjecktValue:[model _fileId]];
}

-(Response *) deleteById: (NSString *) fileId{
  if(!fileId || [fileId length] == 0){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  return [super executeDeleteFromTable:FileContract.TABLE_NAME
                         withObjectKey:FileContract.FILE_ID
                      withObjecktValue:fileId];
}

-(Response *) deleteByIds: (NSArray *) fileIds{
  if(!fileIds || [fileIds count] == 0){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  return [super executeDeleteFromTable:FileContract.TABLE_NAME
                         withObjectKey:FileContract.FILE_ID
                        withObjecktIds:fileIds];
}

-(Response *) deleteAll{
   return [super executeDeleteAllFromTable:FileContract.TABLE_NAME];
}

-(Response *) deleteAllFromBucket:(NSString *) bucketId{
  return [super executeDeleteFromTable:FileContract.TABLE_NAME
                         withObjectKey:FileContract.FILE_FK
                         withObjecktValue:bucketId];
}

-(Response *) updateByModel: (FileModel *) model{
  if(!model || ![model isValid]){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  
  return [super executeUpdateAtTable:FileContract.TABLE_NAME
                           objectKey:FileContract.FILE_ID
                            objectId:[model _fileId]
                    updateDictionary:[[FileDbo fileDboFromFileModel:model]toDictionary]];
}

-(Response *) updateById:(NSString *)fileId
                 starred:(BOOL) isStarred{
  
  if(!fileId || [fileId length] == 0){
    return [[Response alloc]initWithSuccess:NO andWithErrorMessage:@"Model is not valid"];
  }
  return [super executeUpdateAtTable:FileContract.TABLE_NAME
                           objectKey:FileContract.FILE_ID
                            objectId:fileId
                    updateDictionary:@{FileContract.STARRED:@(isStarred)}];
}

+(FileDbo *) getFileDboFromResultSet:(FMResultSet *) resultSet{
  return [[FileDbo alloc] initWithBucketId:[resultSet stringForColumn:FileContract.FILE_FK]
                                   created:[resultSet stringForColumn:FileContract.CREATED]
                                   erasure:[resultSet stringForColumn:FileContract.ERASURE]
                                      hmac:[resultSet stringForColumn:FileContract.HMAC]
                                    fileId:[resultSet stringForColumn:FileContract.FILE_ID]
                                     index:[resultSet stringForColumn:FileContract.INDEX]
                                  mimeType:[resultSet stringForColumn:FileContract.MIME_TYPE]
                                      name:[resultSet stringForColumn:FileContract.NAME]
                                      size:[resultSet longForColumn:FileContract.SIZE]
                               isDecrypted:[resultSet boolForColumn:FileContract.DECRYPTED]
                                 isStarred:[resultSet boolForColumn:FileContract.STARRED]
                                  isSynced:NO];
}

+(NSArray *)getSelectionColumnsString{
  if(!columns){
    NSMutableArray *colArray = [NSMutableArray array];
//    [colArray addObject:FileContract.ID];
    [colArray addObject:FileContract.FILE_ID];
    [colArray addObject:FileContract.NAME];
    [colArray addObject:FileContract.MIME_TYPE];
    [colArray addObject:FileContract.INDEX];
    [colArray addObject:FileContract.HMAC];
    [colArray addObject:FileContract.ERASURE];
    [colArray addObject:FileContract.CREATED];
    [colArray addObject:FileContract.DECRYPTED];
    [colArray addObject:FileContract.SIZE];
    [colArray addObject:FileContract.STARRED];
    [colArray addObject:FileContract.FILE_FK];
    columns = [NSArray arrayWithArray:colArray];
  }
  return columns;
}

@end
