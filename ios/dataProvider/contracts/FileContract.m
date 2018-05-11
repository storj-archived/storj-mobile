//
//  FileContract.m
//  StorjMobile
//
//  Created by Barterio on 3/15/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "FileContract.h"

@implementation FileContract

static NSString * const _TABLE_NAME = @"files";

//static NSString * const _ID = @"id";
static NSString * const _FILE_ID = @"fileId";
static NSString * const _NAME = @"name";
static NSString * const _MIME_TYPE = @"mimeType";
static NSString * const _INDEX = @"_index";
static NSString * const _HMAC = @"hmac";
static NSString * const _ERASURE = @"erasure";
static NSString * const _CREATED = @"created";
static NSString * const _DECRYPTED = @"isDecrypted";
static NSString * const _SIZE = @"size";
static NSString * const _STARRED = @"isStarred";
static NSString * const _SYNCED = @"isSynced";
static NSString * const _DOWNLOAD_STATE = @"downloadState";
static NSString * const _FILE_HANDLE = @"fileHandle";
static NSString * const _FILE_URI = @"fileUri";
static NSString * const _FILE_THUMBNAIL = @"thumbnail";

static NSString * const _FILE_FK = @"bucketId";

+(NSString *) createTable {

  return [NSString stringWithFormat: @"create table if not exists %@ (\
%@ TEXT primary key not null, \
%@ TEXT not null, \
%@ TEXT, \
%@ TEXT, \
%@ TEXT, \
%@ TEXT, \
%@ TEXT not null, \
%@ INTEGER, \
%@ INTEGER, \
%@ INTEGER, \
%@ INTEGER, \
%@ INTEGER DEFAULT 0, \
%@ INTEGER DEFAULT 0, \
%@ TEXT, \
%@ TEXT not null, \
%@ TEXT, \
FOREIGN KEY(%@) REFERENCES buckets(%@) ON DELETE CASCADE);", _TABLE_NAME, _FILE_ID, _NAME,
          _MIME_TYPE, _INDEX, _HMAC, _ERASURE, _CREATED, _DECRYPTED, _STARRED, _SIZE, _SYNCED,
          _DOWNLOAD_STATE, _FILE_HANDLE, _FILE_URI, _FILE_FK, _FILE_THUMBNAIL, _FILE_FK, _FILE_ID];
}

+(NSString *) TABLE_NAME {

  return _TABLE_NAME;
}

//+(NSString *) ID{
//  return _ID;
//}

+(NSString *) FILE_ID {

  return _FILE_ID;
}

+(NSString *) NAME {

  return _NAME;
}

+(NSString *) MIME_TYPE {

  return _MIME_TYPE;
}

+(NSString *) INDEX {

  return _INDEX;
}

+(NSString *) HMAC {

  return _HMAC;
}

+(NSString *) ERASURE {

  return _ERASURE;
}

+(NSString *) CREATED {

  return _CREATED;
}

+(NSString *) DECRYPTED {

  return _DECRYPTED;
}

+(NSString *) SIZE {

  return _SIZE;
}

+(NSString *) STARRED {

  return _STARRED;
}

+(NSString *) SYNCED {

  return _SYNCED;
}

+(NSString *) DOWNLOAD_STATE {

  return _DOWNLOAD_STATE;
}

+(NSString *) FILE_HANDLE {

  return _FILE_HANDLE;
}

+(NSString *) FILE_URI {

  return _FILE_URI;
}

+(NSString *) FILE_THUMBNAIL {

  return _FILE_THUMBNAIL;
}

+(NSString *) FILE_FK {

  return _FILE_FK;
}

@end
