//
//  FileDbo.m
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "FileDbo.h"
#import "FileModel.h"
#import "FileContract.h"

@implementation FileDbo

NSString *_bucketId;
NSString *_created;
NSString *_erasure;
NSString *_hmac;
NSString *_fileId;
NSString *_index;
NSString *_mimeType;
NSString *_name;
long _size;
BOOL _isDecrypted;
BOOL _isStarred;
#pragma mark TODO ADD synced property
BOOL _isSynced;

-(void) setProp: (NSString *) propName
     fromString: (NSString *) propValue
{
  if([FileContract.FILE_FK isEqualToString : propName]){
     _bucketId = propValue;
  }
  if([FileContract.CREATED isEqualToString : propName]){
    _created = propValue;
  }
  if([FileContract.ERASURE isEqualToString : propName]){
    _erasure = propValue;
  }
  if([FileContract.HMAC isEqualToString : propName]){
   _hmac = propValue;
  }
  if([FileContract.INDEX isEqualToString : propName]){
    _index = propValue;
  }
  if([FileContract.MIME_TYPE isEqualToString : propName]){
    _mimeType = propValue;
  }
  if([FileContract.NAME isEqualToString : propName]){
    _name = propValue;
  }
  if([FileContract.FILE_ID isEqualToString:propName]){
    _fileId = propValue;
  }
}

-(void) setProp: (NSString *) propName
       fromBool: (BOOL) propValue
{
  if([FileContract.DECRYPTED isEqualToString : propName]){
    _isDecrypted = propValue;
  }
  if([FileContract.STARRED isEqualToString : propName]){
    _isStarred = propValue;
  }
}

-(void) setProp: (NSString *) propName
       fromLong: (long) propValue
{
  if([FileContract.SIZE isEqualToString : propName]){
    _size = propValue;
  }
}

-(NSString *) getId
{
  return _fileId;
}

- (NSDictionary *)toDictionary {
  NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionary];
  [resultDictionary setObject:_bucketId forKey:FileContract.FILE_FK];
  [resultDictionary setObject:_created forKey:FileContract.CREATED];
  [resultDictionary setObject:_erasure forKey:FileContract.ERASURE];
  [resultDictionary setObject:_hmac forKey:FileContract.HMAC];
  [resultDictionary setObject:_fileId forKey:FileContract.FILE_ID];
  [resultDictionary setObject:_index forKey:FileContract.INDEX];
  [resultDictionary setObject:_mimeType forKey:FileContract.MIME_TYPE];
  [resultDictionary setObject:_name forKey:FileContract.NAME];
  [resultDictionary setObject:@(_size) forKey:FileContract.SIZE];
  [resultDictionary setObject:@(_isDecrypted) forKey:FileContract.DECRYPTED];
  [resultDictionary setObject:@(_isStarred) forKey:FileContract.STARRED];
  return resultDictionary;
}

+(FileDbo *)fileDboFromFileModel:(FileModel *)model{
  FileDbo *dbo = [[FileDbo alloc] init];
  [dbo setProp : FileContract.FILE_FK fromString:[model _bucketId]];
  [dbo setProp : FileContract.CREATED fromString : [model _created]];
  [dbo setProp : FileContract.ERASURE fromString : [model _erasure]];
  [dbo setProp : FileContract.HMAC fromString : [model _hmac]];
  [dbo setProp : FileContract.FILE_ID fromString : [model _fileId]];
  [dbo setProp : FileContract.INDEX fromString : [model _index]];
  [dbo setProp : FileContract.MIME_TYPE fromString : [model _mimeType]];
  [dbo setProp : FileContract.NAME fromString : [model _name]];
//  [dbo setProp : FileContract. fromString : [model _]];
  [dbo setProp : FileContract.SIZE fromLong : [model _size]];
  [dbo setProp : FileContract.DECRYPTED fromBool : [model _isDecrypted]];
  [dbo setProp : FileContract.STARRED fromBool : [model _isStarred]];
  return dbo;
}

-(FileModel *) toModel{
  return [[FileModel alloc] initWithBucketId:_bucketId
                                     created:_created
                                     erasure:_erasure
                                        hmac:_hmac
                                      fileId:_fileId
                                       index:_index
                                    mimeType:_mimeType
                                        name:_name
                                        size:_size
                                 isDecrypted:_isDecrypted
                                   isStarred:_isStarred];
}

@end
