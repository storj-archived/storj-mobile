//
//  STFileDeleteModel.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
#import "IConvertibleToJS.h"

#define FILE_DELETE_MODEL_BUCKET_ID "bucketId"
#define FILE_DELETE_MODEL_FILE_ID "fileId"

@interface STFileDeleteModel : NSObject<IConvertibleToJS>

@property (nonatomic, strong) NSString *_bucketId;
@property (nonatomic, strong) NSString *_fileId;

-(instancetype) initWithBucketId: (NSString *)bucketId
                          fileId: (NSString *)fileId;

-(BOOL)isValid;

@end
