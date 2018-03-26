//
//  UploadFileContract.m
//  StorjMobile
//
//  Created by Barterio on 3/15/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "UploadFileContract.h"

@implementation UploadFileContract

static NSString *const _TABLE_NAME = @"uploadingFiles";
static NSString *const _ID = @"id";
static NSString *const _FILE_HANDLE = @"fileHandle";
static NSString *const _NAME = @"name";
static NSString *const _URI = @"uri";
static NSString *const _PROGRESS = @"progress";
static NSString *const _SIZE = @"size";
static NSString *const _UPLOADED = @"uploaded";
static NSString *const _BUCKET_ID = @"bucketId";

+(NSString *) TABLE_NAME{
  return _TABLE_NAME;
}

+(NSString *) ID{
  return _ID;
}

+(NSString *) FILE_HANDLE{
  return _FILE_HANDLE;
}

+(NSString *) NAME{
  return _NAME;
}

+(NSString *) URI{
  return _URI;
}

+(NSString *) PROGRESS{
  return _PROGRESS;
}

+(NSString *) SIZE{
  return _SIZE;
}

+(NSString *) UPLOADED{
  return _UPLOADED;
}

+(NSString *) BUCKET_ID{
  return _BUCKET_ID;
}

+(NSString *)createTable{
  return [NSString stringWithFormat:@"create table if not exists %@ (\
%@ INTEGER primary key not null, \
%@ TEXT not null, \
%@ TEXT not null, \
%@ INTEGER default 0, \
%@ INTEGER default 0, \
%@ INTEGER default 0, \
%@ TEXT not null, \
FOREIGN KEY(%@) REFERENCES buckets(%@))", _TABLE_NAME, _ID, _NAME, _URI, _PROGRESS, _SIZE,
          _UPLOADED, _BUCKET_ID, _BUCKET_ID, _ID];
}

@end
