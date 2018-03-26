//
//  FileDeleteModel.h
//  StorjMobile
//
//  Created by Barterio on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "IConvertibleToJS.h"
#import "DictionaryUtils.h"
#import <Foundation/Foundation.h>

#define FILE_DELETE_MODEL_BUCKET_ID "bucketId"
#define FILE_DELETE_MODEL_FILE_ID "fileId"

@interface FileDeleteModel : NSObject<IConvertibleToJS>

@property (nonatomic, strong) NSString *_bucketId;
@property (nonatomic, strong) NSString *_fileId;

-(instancetype) initWithBucketId: (NSString *)bucketId
                          fileId: (NSString *)fileId;

-(BOOL)isValid;

@end
