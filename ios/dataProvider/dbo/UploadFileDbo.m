//
//  UploadFileDbo.m
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "UploadFileDbo.h"


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

@end




