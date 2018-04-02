//
//  BucketContract.m
//  StorjMobile
//
//  Created by Barterio on 3/15/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "BucketContract.h"

@implementation BucketContract
static NSString * const _TABLE_NAME = @"buckets";
static NSString * const _ID = @"id";
static NSString * const _NAME = @"name";
static NSString * const _CREATED = @"created";
static NSString * const _DECRYPTED = @"isDecrypted";
static NSString * const _HASH_CODE = @"hash";
static NSString * const _STARRED = @"isStarred";

+(NSString *)createTable{
  return [NSString stringWithFormat:@"create table if not exists %@ (\
%@ TEXT primary key not null, \
%@ TEXT not null, \
%@ TEXT not null, \
%@ INTEGER, \
%@ INTEGER, \
%@ TEXT not null)", _TABLE_NAME, _ID, _CREATED, _NAME, _DECRYPTED, _STARRED, _HASH_CODE];
}

+(NSString *) TABLE_NAME{
  return _TABLE_NAME;
}

+(NSString *) ID{
  return _ID;
}

+(NSString *) NAME{
  return _NAME;
}

+(NSString *) CREATED{
  return _CREATED;
}

+(NSString *) DECRYPTED{
  return _DECRYPTED;
}

+(NSString *) HASH_CODE{
  return _HASH_CODE;
}

+(NSString *) STARRED{
  return _STARRED;
}

@end
