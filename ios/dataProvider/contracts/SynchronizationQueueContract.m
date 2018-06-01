//
//  SynchronizationQueueContract.m
//  StorjMobile
//
//  Created by Developer Mac on 31.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SynchronizationQueueContract.h"

@implementation SynchronizationQueueContract

static NSString * const _TABLE_NAME = @"SynchronizationQueue";

static NSString * const _ID = @"_id";
static NSString * const _FILE_NAME = @"fileName";
static NSString * const _LOCAL_PATH = @"localPath";
static NSString * const _STATUS = @"status";
static NSString * const _ERROR_CODE = @"errorCode";
static NSString * const _SIZE = @"size";
static NSString * const _COUNT = @"count";
static NSString * const _CREATION_DATE = @"creationDate";

static NSString * const _FILE_HANDLE = @"fileHandle";
static NSString * const _BUCKET_ID = @"bucketId";

+(NSString *) TABLE_NAME
{
  return _TABLE_NAME;
}

+(NSString *) ID
{
  return _ID;
}

+(NSString *) FILE_NAME
{
  return _FILE_NAME;
}

+(NSString *) LOCAL_PATH
{
  return _LOCAL_PATH;
}

+(NSString *) STATUS
{
  return _STATUS;
}

+(NSString *) ERROR_CODE
{
  return _ERROR_CODE;
}

+(NSString *) SIZE
{
  return _SIZE;
}

+(NSString *) COUNT
{
  return _COUNT;
}

+(NSString *) CREATION_DATE
{
  return _CREATION_DATE;
}

+(NSString *) FILE_HANDLE
{
  return _FILE_HANDLE;
}

+(NSString *) BUCKET_ID
{
  return _BUCKET_ID;
}

+(NSString *) createTable
{
  return [NSString stringWithFormat: @"create table if not exists %@ (\
%@ INTEGER primary key AUTOINCREMENT not null, \
%@ TEXT not null, \
%@ TEXT not null, \
%@ INTEGER default 0, \
%@ INTEGER default 0, \
%@ INTEGER default 0, \
%@ INTEGER default 0, \
%@ TIMESTAMP default CURRENT_TIMESTAMP, \
%@ TEXT not null, \
%@ INTEGER, \
FOREIGN KEY(%@) REFERENCES uploadingFiles(%@) ON DELETE CASCADE, \
FOREIGN KEY(%@) REFERENCES buckets(%@) ON DELETE CASCADE);",
          _TABLE_NAME, _ID, _FILE_NAME, _LOCAL_PATH, _STATUS, _ERROR_CODE, _SIZE, _COUNT,
          _CREATION_DATE, _BUCKET_ID, _FILE_HANDLE, _FILE_HANDLE, _FILE_HANDLE, _BUCKET_ID, _ID];
}

@end


