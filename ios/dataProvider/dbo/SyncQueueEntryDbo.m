//
//  SynchronizationQueueEntryDbo.m
//  StorjMobile
//
//  Created by Developer Mac on 31.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SyncQueueEntryDbo.h"

@implementation SyncQueueEntryDbo

-(instancetype) init
{
  return [super init];
}

-(instancetype) initWithId: (int) _id
                fileName: (NSString *) fileName
                localPath: (NSString *) localPath
                status: (int) status
                errorCode: (int) errorCode
                size: (long) size
                count: (int) count
                creationDate: (NSString *) creationDate
                bucketId: (NSString *) bucketId
                fileHandle: (long) fileHandle
{
  if(self = [super init])
  {
    __id = _id;
    _fileName = fileName;
    _localPath = localPath;
    _status = status;
    _errorCode = errorCode;
    _size = size;
    _count = count;
    _creationDate = creationDate;
    _bucketId = bucketId;
    _fileHandle = fileHandle;
  }
  
  return self;
}

@end
