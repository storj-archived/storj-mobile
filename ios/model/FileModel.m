//
//  FileModel.m
//  StorjMobile
//
//  Created by Barterio on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "FileModel.h"

@implementation FileModel

@synthesize _bucketId;
@synthesize _fileId;
@synthesize _created;
@synthesize _name;
@synthesize _hmac;
@synthesize _index;
@synthesize _erasure;
@synthesize _mimeType;
@synthesize _size;
@synthesize _isDecrypted;
@synthesize _isStarred;
@synthesize _isSynced;

-(instancetype)initWithBucketId:(NSString *)bucketId
                        created:(NSString *)created
                        erasure:(NSString *)erasure
                           hmac:(NSString *)hmac
                         fileId:(NSString *)fileId
                          index:(NSString *)index
                       mimeType:(NSString *)mimeType
                           name:(NSString *)name
                           size:(long)size
                    isDecrypted:(BOOL)isDecrypted
                      isStarred:(BOOL)isStarred
{
  return [self initWithBucketId:bucketId
                        created:created
                        erasure:erasure
                           hmac:hmac
                         fileId:fileId
                          index:index
                       mimeType:mimeType
                           name:name
                           size:size
                    isDecrypted:isDecrypted
                      isStarred:isStarred
                       isSynced:NO];
}

-(instancetype)initWithBucketId:(NSString *)bucketId
                        created:(NSString *)created
                        erasure:(NSString *)erasure
                           hmac:(NSString *)hmac
                         fileId:(NSString *)fileId
                          index:(NSString *)index
                       mimeType:(NSString *)mimeType
                           name:(NSString *)name
                           size:(long)size
                    isDecrypted:(BOOL)isDecrypted
                      isStarred:(BOOL)isStarred
                       isSynced:(BOOL)isSynced
{
  if(self = [super init]){
    _bucketId = bucketId;
    _created = created;
    _erasure = erasure;
    _hmac = hmac;
    _fileId = fileId;
    _index = index;
    _mimeType = mimeType;
    _name = name;
    _size = size;
    _isDecrypted = isDecrypted;
    _isStarred = isStarred;
    _isSynced = isSynced;
  }
  return self;
}

-(BOOL) isValid{
  return NO;
}

- (NSDictionary *)toDictionary {
  NSMutableDictionary *object = [[NSMutableDictionary alloc] init];
  [object setObject:_bucketId forKey:@FILE_MODEL_BUCKET_ID];
  [object setObject:_created forKey:@FILE_MODEL_CREATED];
  [object setObject:_erasure forKey:@FILE_MODEL_ERASURE];
  [object setObject:_hmac forKey:@FILE_MODEL_HMAC];
  [object setObject:_fileId forKey:@FILE_MODEL_FILE_ID];
  [object setObject:_index forKey:@FILE_MODEL_INDEX];
  [object setObject:_mimeType forKey:@FILE_MODEL_MIME_TYPE];
  [object setObject:_name forKey:@FILE_MODEL_NAME];
  [object setObject:@(_size) forKey:@FILE_MODEL_SIZE];
  [object setObject:@(_isDecrypted) forKey:@FILE_MODEL_IS_DECRYPTED];
  [object setObject:@(_isStarred) forKey:@FILE_MODEL_IS_STARRED];
  return object;
}

@end
