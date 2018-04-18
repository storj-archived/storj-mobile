//
//  UploadFileModel.h
//  StorjMobile
//
//  Created by Barterio on 3/22/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "IConvertibleToJS.h"
#import "DictionaryUtils.h"
#import "UploadFileContract.h"
@class UploadFileDbo;
@class UploadFileContract;

@interface UploadFileModel : NSObject<IConvertibleToJS>
@property (nonatomic, strong, getter=name) NSString *_name;
@property (nonatomic, strong, getter=bucketId) NSString *_bucketId;
@property (nonatomic, strong, getter=uri) NSString *_uri;
@property (nonatomic, getter=fileHandle) long _fileHandle;
@property (nonatomic, getter=uploaded) long _uploaded;
@property (nonatomic, getter=size) long _size;
@property (nonatomic, getter=progress) double _progress;

//base
-(instancetype)initWithFileHandle:(long) fileHandle
                         progress:(double)progress
                             size:(long) size
                         uploaded:(long) uploaded
                             name:(NSString *)name
                              uri:(NSString *)uri
                         bucketId:(NSString *)bucketId;

-(instancetype)initWithUploadFileDbo:(UploadFileDbo *)fileDbo;

-(instancetype)initWithFileHandle:(long)fileHandle
                             size:(long)size
                             name:(NSString *)name
                              uri:(NSString *)uri
                         bucketId:(NSString *)bucketId;

-(BOOL)isValid;
- (NSDictionary *)toDictionaryProgress;

@end
