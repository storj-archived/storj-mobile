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

#import "DictionaryUtils.h"

#import "Response.h"

@implementation FileRepository

static NSArray * columns;

-(instancetype) init
  {
    return [super init];
  }

-(NSArray *) getAll {
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@",
                       [[FileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       FileContract.TABLE_NAME];
  __block NSMutableArray<FileDbo *> * fileDboArray = [NSMutableArray<FileDbo *> array];
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request];
    if(!resultSet) {
      NSLog(@"No result set returned");
      
      return;
    }
    
    while ([resultSet next]) {
      FileDbo * dbo = [FileRepository getFileDboFromResultSet:resultSet];
      if(dbo) {
        [fileDboArray addObject:dbo];
      }
    }
    [resultSet close];
  }];
  [queue close];
  
  return fileDboArray;
}

-(NSArray *) getAllFromBucket:(NSString *)bucketId {
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[FileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       FileContract.TABLE_NAME,
                       FileContract.FILE_FK];
  __block NSMutableArray <FileDbo *> * fileDboArray = [NSMutableArray <FileDbo *> array];
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet *resultSet = [db executeQuery:request, bucketId];
    if(!resultSet) {
      NSLog(@"No result set returned");
      return;
    }
    
    while([resultSet next]) {
      FileDbo *dbo = [FileRepository getFileDboFromResultSet:resultSet];
      if(dbo){
        [fileDboArray addObject:dbo];
      }
    }
    [resultSet close];
  }];
  [queue close];
  
  return fileDboArray;
}

-(NSArray *) getAllFromBucket:(NSString *)bucketId
                orderByColumn: (NSString *) columnName
                   descending: (BOOL) isDescending {
  NSString *orderByColumn = columnName;
  if(!columnName || columnName.length == 0) {
    orderByColumn = FileContract.NAME;
  }
  
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ? ORDER BY %@ COLLATE NOCASE %@",
                       [[FileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       FileContract.TABLE_NAME,
                       FileContract.FILE_FK,
                       orderByColumn,
                       isDescending ? @"DESC" : @"ASC"];
  __block NSMutableArray <FileDbo *> * fileDboArray = [NSMutableArray <FileDbo *> array];
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet *resultSet = [db executeQuery:request, bucketId];
    if(!resultSet) {
      NSLog(@"No result set returned");
      return;
    }
    
    while([resultSet next]) {
      FileDbo *dbo = [FileRepository getFileDboFromResultSet:resultSet];
      if(dbo){
        [fileDboArray addObject:dbo];
      }
    }
    [resultSet close];
  }];
  [queue close];
  
  return fileDboArray;
}

-(NSArray *) getAllWithOrderByColumn: (NSString *) columnName
                               order: (BOOL) isDescending {
  NSString *orderByColumn = columnName;
  if(!columnName || [columnName length] == 0) {
    orderByColumn = FileContract.CREATED;
  }
  
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ ORDER BY %@ COLLATE NOCASE s%@",
                       [[FileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       FileContract.TABLE_NAME,
                       orderByColumn,
                       isDescending ? @"DESC" : @"ASC"];
  __block NSMutableArray<FileDbo *> * fileDboArray = [NSMutableArray<FileDbo *> array];
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request];
    if(!resultSet) {
      NSLog(@"No result set returned");
  
      return;
    }
    
    while ([resultSet next]) {
      FileDbo * dbo = [FileRepository getFileDboFromResultSet:resultSet];
      if(dbo) {
        [fileDboArray addObject:dbo];
      }
    }
    [resultSet close];
  }];
  [queue close];
  
  return fileDboArray;
}

-(NSArray *) getStarred {
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[FileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       FileContract.TABLE_NAME,
                       FileContract.STARRED];
  __block NSMutableArray<FileDbo *> * fileDboArray = [NSMutableArray<FileDbo *> array];
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request, 1];
    if(!resultSet) {
      NSLog(@"No result set returned");
      
      return;
    }
  
    while ([resultSet next]) {
      FileDbo * dbo = [FileRepository getFileDboFromResultSet:resultSet];
      if(dbo) {
        [fileDboArray addObject:dbo];
      }
    }
    [resultSet close];
  }];
  [queue close];
  
  return fileDboArray;
}

-(FileDbo *) getByFileId:(NSString *) fileId {
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       [[FileRepository getSelectionColumnsString]componentsJoinedByString:@","],
                       FileContract.TABLE_NAME,
                       FileContract.FILE_ID];
  __block FileDbo * dbo = nil;
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request, fileId];
    if(!resultSet) {
      NSLog(@"No result set returned");
      return;
    }
    
    if([resultSet next]) {
      dbo = [FileRepository getFileDboFromResultSet:resultSet];
    }
    [resultSet close];
  }];
  [queue close];
  
  return dbo;
}

-(FileDbo *) getByColumnName:(NSString *) columnName
                 columnValue:(NSString *) columnValue {
  NSString *request = [NSString stringWithFormat:@"SELECT %@ FROM %@ WHERE %@ = ?",
                       columnName,
                       FileContract.TABLE_NAME,
                       columnName];
  __block FileDbo *dbo = nil;
  FMDatabaseQueue *queue = [self readableQueue];
  [queue inDatabase:^(FMDatabase * _Nonnull db) {
    FMResultSet * resultSet = [db executeQuery:request, columnValue];
    if(!resultSet) {
      NSLog(@"No result set returned");
      return;
    }
    
    if([resultSet next]){
      dbo = [FileRepository getFileDboFromResultSet:resultSet];
    }
    [resultSet close];
  }];
  [queue close];
  
  return dbo;
}

-(Response *) insertWithModel: (FileModel *) model {
  NSLog(@"Inserting file: %@", [model toDictionary]);
  if(!model || ![model isValid]) {
    
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  return [super executeInsertIntoTable:FileContract.TABLE_NAME
                              fromDict:[[FileDbo fileDboFromFileModel:model] toDictionary]];
}

-(Response *) deleteByModel: (FileModel *) model {
  if(!model || ![model isValid]) {
    
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  return [super executeDeleteFromTable:FileContract.TABLE_NAME
                         withObjectKey:FileContract.FILE_ID
                      withObjecktValue:[model _fileId]];
}

-(Response *) deleteById: (NSString *) fileId {
  if(!fileId || [fileId length] == 0) {
    
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  return [super executeDeleteFromTable:FileContract.TABLE_NAME
                         withObjectKey:FileContract.FILE_ID
                      withObjecktValue:fileId];
}

-(Response *) deleteByIds: (NSArray *) fileIds {
  if(!fileIds || [fileIds count] == 0) {
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  return [super executeDeleteFromTable:FileContract.TABLE_NAME
                         withObjectKey:FileContract.FILE_ID
                        withObjecktIds:fileIds];
}

-(Response *) deleteAll {
  
   return [super executeDeleteAllFromTable:FileContract.TABLE_NAME];
}

-(Response *) deleteAllFromBucket:(NSString *) bucketId {
  
  return [super executeDeleteFromTable:FileContract.TABLE_NAME
                         withObjectKey:FileContract.FILE_FK
                         withObjecktValue:bucketId];
}

-(Response *) updateByModel: (FileModel *) model {
  if(!model || ![model isValid]) {
    
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  NSMutableDictionary *updateDictionary = [NSMutableDictionary dictionary];
  [updateDictionary setObject:[DictionaryUtils checkAndReturnNSString:[model _created]]
                       forKey:FileContract.CREATED];
  [updateDictionary setObject:@([model _isDecrypted])
                       forKey:FileContract.DECRYPTED];
  [updateDictionary setObject:[DictionaryUtils checkAndReturnNSString:[model _erasure]]
                       forKey:FileContract.ERASURE];
  [updateDictionary setObject:[DictionaryUtils checkAndReturnNSString:[model _hmac]]
                       forKey:FileContract.HMAC];
  [updateDictionary setObject:[DictionaryUtils checkAndReturnNSString:[model _index]]
                       forKey:FileContract.INDEX];
  [updateDictionary setObject:[DictionaryUtils checkAndReturnNSString:[model _mimeType]]
                       forKey:FileContract.MIME_TYPE];
  [updateDictionary setObject:@([model _size])
                       forKey:FileContract.SIZE];
  [updateDictionary setObject:[DictionaryUtils checkAndReturnNSString:[model _bucketId]]
                       forKey:FileContract.FILE_FK];
  [updateDictionary setObject:[DictionaryUtils checkAndReturnNSString:[model _name]]
                       forKey:FileContract.NAME];
  
  return [super executeUpdateAtTable:FileContract.TABLE_NAME
                           objectKey:FileContract.FILE_ID
                            objectId:[model _fileId]
                    updateDictionary:updateDictionary];
}

-(Response *) updateById:(NSString *)fileId
                 starred:(BOOL) isStarred {
  
  if(!fileId || [fileId length] == 0) {
    
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  return [super executeUpdateAtTable:FileContract.TABLE_NAME
                           objectKey:FileContract.FILE_ID
                            objectId:fileId
                    updateDictionary:@{FileContract.STARRED:@(isStarred)}];
}
-(Response *) updateById: (NSString *) fileId
           downloadState: (int) downloadState
              fileHandle: (long) fileHandle
                 fileUri: (NSString *) fileUri {
  NSLog(@"fileId %@, downloadState %d, fileHandle %lu, uri %@", fileId, downloadState, fileHandle, fileUri);
  
  if(!fileId || fileId.length == 0){
    
    return [Response errorResponseWithMessage:@"Model is not valid"];
  }
  
  return [super executeUpdateAtTable:FileContract.TABLE_NAME
                           objectKey:FileContract.FILE_ID
                            objectId:[DictionaryUtils checkAndReturnNSString:fileId]
                    updateDictionary:@{FileContract.DOWNLOAD_STATE: @(downloadState),
                                       FileContract.FILE_HANDLE: @(fileHandle),
                                       FileContract.FILE_URI: [DictionaryUtils checkAndReturnNSString:fileUri]}];
}

-(Response *) updateThumbnailWithFileId: (NSString *) fileId
                        thumbnailBase64: (NSString *) thumbnailBase64String {
  if(!fileId || fileId.length == 0){
    return [Response errorResponseWithMessage:@"FileId is not valid"];
  }
  
  if(!thumbnailBase64String || thumbnailBase64String.length == 0){
    return [Response errorResponseWithMessage:@"Base64 representation of image is not valid"];
  }
  
  return [super executeUpdateAtTable:FileContract.TABLE_NAME
                           objectKey:FileContract.FILE_ID
                            objectId:fileId
                    updateDictionary:@{FileContract.FILE_THUMBNAIL: thumbnailBase64String}];
}

+(FileDbo *) getFileDboFromResultSet:(FMResultSet *) resultSet {
  
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
                                  isSynced:NO
                             downloadState:[resultSet intForColumn:FileContract.DOWNLOAD_STATE]
                                fileHandle:[resultSet longForColumn:FileContract.FILE_HANDLE]
                                   fileUri:[resultSet stringForColumn:FileContract.FILE_URI]
                                 thumbnail:[resultSet stringForColumn:FileContract.FILE_THUMBNAIL]];
}

+(NSArray *)getSelectionColumnsString {
  if(!columns) {
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
    [colArray addObject:FileContract.SYNCED];
    [colArray addObject:FileContract.FILE_FK];
    [colArray addObject:FileContract.DOWNLOAD_STATE];
    [colArray addObject:FileContract.FILE_HANDLE];
    [colArray addObject:FileContract.FILE_URI];
    [colArray addObject:FileContract.FILE_THUMBNAIL];
    columns = [NSArray arrayWithArray:colArray];
  }
  
  return columns;
}

@end
