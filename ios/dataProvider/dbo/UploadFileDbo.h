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
@interface UploadFileDbo : NSObject<NSCopying>

@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *bucketId;
@property (nonatomic, strong) NSString *uri;
@property (nonatomic) long fileHandle;
@property (nonatomic) long uploaded;
@property (nonatomic) long size;
@property (nonatomic) double progress;

-(instancetype) initWithFileHandle: (long) fileHandle
                         progress: (double)progress
                             size: (long) size
                         uploaded: (long) uploaded
                             name: (NSString *)name
                              uri: (NSString *)uri
                         bucketId: (NSString *)bucketId;

-(UploadFileModel *) toModel;

@end
