//
//  UploadFileDbo.h
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <UIKit/UIKit.h>
@class UploadFileModel;
@interface UploadFileDbo : NSObject

@property (nonatomic, strong, getter=name) NSString *_name;
@property (nonatomic, strong, getter=bucketId) NSString *_bucketId;
@property (nonatomic, strong, getter=uri) NSString *_uri;
@property (nonatomic, getter=fileHandle) long _fileHandle;
@property (nonatomic, getter=uploaded) long _uploaded;
@property (nonatomic, getter=size) long _size;
@property (nonatomic, getter=progress) double _progress;

-(instancetype)initWithFileHandle:(long) fileHandle
                         progress:(double)progress
                             size:(long) size
                         uploaded:(long) uploaded
                             name:(NSString *)name
                              uri:(NSString *)uri
                         bucketId:(NSString *)bucketId;

-(UploadFileModel *) toModel;

-(long) getId;

-(void) setProp: (NSString *) propName
     fromString: (NSString *) propValue;

-(void) setProp: (NSString *) propName
       fromDouble: (double) propValue;

-(void) setProp: (NSString *) propName
       fromLong: (long) propValue;

@end
