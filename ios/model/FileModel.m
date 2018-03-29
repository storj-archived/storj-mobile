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

-(instancetype) initWithSJFile:(SJFile *)sjFile{
  return [self initWithBucketId:[sjFile _bucketId]
                        created:[sjFile _created]
                        erasure:[sjFile _erasure]
                           hmac:[sjFile _hmac]
                         fileId:[sjFile _fileId]
                          index:[sjFile _index]
                       mimeType:[sjFile _mimeType]
                           name:[sjFile _name]
                           size:[sjFile _size]
                    isDecrypted:[sjFile _isDecrypted]
                      isStarred:NO
                       isSynced:NO];
}

-(instancetype) initWithFileDbo: (FileDbo *) dbo{
  return[self initWithBucketId:[dbo _bucketId]
                       created:[dbo _created]
                       erasure:[dbo _erasure]
                          hmac:[dbo _hmac]
                        fileId:[dbo _fileId]
                         index:[dbo _index]
                      mimeType:[dbo _mimeType]
                          name:[dbo _name]
                          size:[dbo _size]
                   isDecrypted:[dbo _isDecrypted]
                     isStarred:[dbo _isStarred]
                      isSynced:[dbo _isSynced]];
}

-(BOOL) isValid{
  return [DictionaryUtils isNSStringValid:_bucketId] && [DictionaryUtils isNSStringValid:_created]
   && [DictionaryUtils isNSStringValid:_hmac]  && [DictionaryUtils isNSStringValid:_fileId]
  && [DictionaryUtils isNSStringValid:_mimeType] && [DictionaryUtils isNSStringValid:_name];
}

- (NSDictionary *)toDictionary {
  NSMutableDictionary *object = [[NSMutableDictionary alloc] init];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_bucketId] forKey:@FILE_MODEL_BUCKET_ID];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_created] forKey:@FILE_MODEL_CREATED];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_erasure] forKey:@FILE_MODEL_ERASURE];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_hmac] forKey:@FILE_MODEL_HMAC];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_fileId] forKey:@FILE_MODEL_FILE_ID];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_index] forKey:@FILE_MODEL_INDEX];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_mimeType] forKey:@FILE_MODEL_MIME_TYPE];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_name] forKey:@FILE_MODEL_NAME];
  [object setObject:@(_size) forKey:@FILE_MODEL_SIZE];
  [object setObject:@(_isDecrypted) forKey:@FILE_MODEL_IS_DECRYPTED];
  [object setObject:@(_isStarred) forKey:@FILE_MODEL_IS_STARRED];
  return object;
}

@end
