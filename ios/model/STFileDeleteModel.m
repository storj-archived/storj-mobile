//
//  STFileDeleteModel.m
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STFileDeleteModel.h"
#import "DictionaryUtils.h"

@implementation STFileDeleteModel

@synthesize _bucketId;
@synthesize _fileId;

-(instancetype)initWithBucketId:(NSString *)bucketId
                         fileId:(NSString *)fileId
{
  if(self = [super init]){
    _bucketId = bucketId;
    _fileId = fileId;
  }
  return self;
}

-(BOOL)isValid{
  return _bucketId != nil && [_bucketId length] > 0
    && _fileId != nil && [_fileId length] > 0;
}

-(NSDictionary *) toDictionary{
  NSMutableDictionary *object = [[NSMutableDictionary alloc] init];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_bucketId]
             forKey:@FILE_DELETE_MODEL_BUCKET_ID];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_fileId]
             forKey:@FILE_DELETE_MODEL_FILE_ID];
  return object;
}

@end
