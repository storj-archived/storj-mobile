//
//  UploadFileDbo.m
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "UploadFileDbo.h"
#import "UploadFileModel.h"
#import "UploadFileContract.h"

@implementation UploadFileDbo
@synthesize _bucketId,_fileHandle,_name,_progress,_size,_uploaded,_uri;
BOOL isIdSet = false;

-(instancetype)initWithFileHandle:(long) fileHandle
                         progress:(double)progress
                             size:(long) size
                         uploaded:(long) uploaded
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

-(UploadFileModel *) toModel{
  return [[UploadFileModel alloc]initWithFileHandle:_fileHandle progress:_progress size:_size uploaded:_uploaded name:_name uri:_uri bucketId:_bucketId];
}

-(long) getId{
  return _fileHandle;
}

-(void) setProp: (NSString *) propName
     fromString: (NSString *) propValue{
  if([UploadFileContract.NAME isEqualToString:propName]){
    _name = propValue;
  }
  if([UploadFileContract.URI isEqualToString:propName]){
    _uri = propValue;
  }
  if([UploadFileContract.BUCKET_ID isEqualToString:propName]){
    _bucketId = propValue;
  }
}

-(void) setProp: (NSString *) propName
       fromDouble: (double) propValue{
  if([UploadFileContract.PROGRESS isEqualToString:propName]){
    _progress = propValue;
  }
}

-(void) setProp: (NSString *) propName
       fromLong: (long) propValue{
  if([UploadFileContract.FILE_HANDLE isEqualToString:propName]){
    _fileHandle = propValue;
  }
  if([UploadFileContract.SIZE isEqualToString:propName]){
    _size = propValue;
  }
  if([UploadFileContract.UPLOADED isEqualToString:propName]){
    _uploaded = propValue;
  }
}

@end




