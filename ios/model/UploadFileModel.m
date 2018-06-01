//
//  UploadFileModel.m
//  StorjMobile
//
//  Created by Barterio on 3/22/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "UploadFileModel.h"
#import "UploadFileDbo.h"
#import "UploadFileContract.h"
#import "DictionaryUtils.h"

@implementation UploadFileModel
@synthesize _bucketId, _fileHandle, _name, _progress, _size, _uploaded, _uri;

-(instancetype)initWithFileHandle:(long)fileHandle
                         progress:(double)progress
                             size:(long)size
                         uploaded:(long)uploaded
                             name:(NSString *)name
                              uri:(NSString *)uri
                         bucketId:(NSString *)bucketId{
  if(self = [super init]){
    _fileHandle = fileHandle;
    _progress = progress;
    _size = size;
    _uploaded = uploaded;
    _name = name;
    _uri = uri;
    _bucketId = bucketId;
  }
  return self;
}

-(instancetype)initWithFileHandle:(long)aFileHandle
                             size:(long)size
                             name:(NSString *)name
                              uri:(NSString *)uri
                         bucketId:(NSString *)bucketId{
  
  return [self initWithFileHandle:aFileHandle
                         progress:0
                             size:size
                         uploaded:0
                             name:name
                              uri:uri
                         bucketId:bucketId];
}

-(instancetype)initWithUploadFileDbo:(UploadFileDbo *)fileDbo{
  if(!fileDbo){
    return nil;
  }
  return [self initWithFileHandle:[fileDbo fileHandle]
                         progress:[fileDbo progress]
                             size:[fileDbo size]
                         uploaded:[fileDbo uploaded]
                             name:[fileDbo name]
                              uri:[fileDbo uri]
                         bucketId:[fileDbo bucketId]];
}

-(BOOL)isValid{
  return /*_size > 0 &&*/ _name && [_name length] > 0
  && _uri && [_uri length] > 0
  && _bucketId && [_bucketId length] > 0;
}

- (NSDictionary *)toDictionary {
  NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionary];
  [resultDictionary setObject:@(_fileHandle) forKey:UploadFileContract.ID];
  [resultDictionary setObject:@(_progress) forKey:UploadFileContract.PROGRESS];
  [resultDictionary setObject:@(_size) forKey:UploadFileContract.SIZE];
  [resultDictionary setObject:@(_uploaded) forKey:UploadFileContract.UPLOADED];
  [resultDictionary setObject:[DictionaryUtils checkAndReturnNSString:_name] forKey:UploadFileContract.NAME];
  [resultDictionary setObject:[DictionaryUtils checkAndReturnNSString:_uri] forKey:UploadFileContract.URI];
  [resultDictionary setObject:[DictionaryUtils checkAndReturnNSString:_bucketId] forKey:UploadFileContract.BUCKET_ID];
  return resultDictionary;
}

- (NSDictionary *)toDictionaryProgress {
  NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionary];
  [resultDictionary setObject:@(_fileHandle) forKey:UploadFileContract.FILE_HANDLE];
  [resultDictionary setObject:@(_progress) forKey:UploadFileContract.PROGRESS];
  [resultDictionary setObject:@(_size) forKey:UploadFileContract.SIZE];
  [resultDictionary setObject:@(_uploaded) forKey:UploadFileContract.UPLOADED];
  [resultDictionary setObject:[DictionaryUtils checkAndReturnNSString:_name] forKey:UploadFileContract.NAME];
  [resultDictionary setObject:[DictionaryUtils checkAndReturnNSString:_uri] forKey:UploadFileContract.URI];
  [resultDictionary setObject:[DictionaryUtils checkAndReturnNSString:_bucketId] forKey:UploadFileContract.BUCKET_ID];
  return resultDictionary;
}

@end
