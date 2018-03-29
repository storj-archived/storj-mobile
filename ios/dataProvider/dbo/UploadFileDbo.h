//
//  UploadFileDbo.h
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UploadFileModel.h"
#import "UploadFileContract.h"
#import "IConvertibleToJS.h"
@interface UploadFileDbo : NSObject<IConvertibleToJS, NSCopying>{
  long _fileHandle;
  double _progress;
  long _size;
  long _uploaded;
  NSString * _name;
  NSString * _uri;
  NSString * _bucketId;
}

@property (nonatomic, strong, getter=name) NSString *_name;
@property (nonatomic, strong, getter=bucketId) NSString *_bucketId;
@property (nonatomic, strong, getter=uri) NSString *_uri;
@property (nonatomic, getter=fileHandle) long _fileHandle;
@property (nonatomic, getter=uploaded) long _uploaded;
@property (nonatomic, getter=size) long _size;
@property (nonatomic, getter=progress) double _progress;

+(UploadFileDbo *)uploadFileDboFromUploadFileModel: (UploadFileModel *)model;

-(instancetype)initWithFileHandle:(long) fileHandle
                         progress:(double)progress
                             size:(long) size
                         uploaded:(long) uploaded
                             name:(NSString *)name
                              uri:(NSString *)uri
                         bucketId:(NSString *)bucketId;

-(UploadFileModel *) toModel;

@end
