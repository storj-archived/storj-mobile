//
//  BucketDbo.m
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "BucketDbo.h"
#import "DictionaryUtils.h"

@implementation BucketDbo

@synthesize _id, _created, _hash, _isDecrypted, _isStarred, _name;



+(BucketDbo *)bucketDboFromBucketModel:(BucketModel *)model{
  return [[BucketDbo alloc] initWithBucketModel:model];
}

-(instancetype) initWithBucketModel: (BucketModel *) model{
  return [self initWithId:[model _id]
                     name:[model name]
                  created:[model created]
                     hash:[model hash]
              isDecrypted:[model isDecrypted]
                isStarred:[model isStarred]];
}

-(instancetype) initWithId: (NSString *) modelId
                      name: (NSString *) name
                   created: (NSString *) created
                      hash: (long) hash
               isDecrypted: (BOOL) isDecrypted
                 isStarred: (BOOL) isStarred{
  if(self = [super init]){
    _id = modelId;
    _name = name;
    _created = created;
    _hash = hash;
    _isDecrypted = isDecrypted;
    _isStarred = isStarred;
  }
  return self;
}

-(instancetype) init{
  if(self = [super init]){
    
  }
  return self;
}

-(BucketModel *)toModel{
  return [[BucketModel alloc] initWithId:_id
                             name:_name
                          created:_created
                             hash:_hash
                      isDecrypted:_isDecrypted
                        isStarred:_isStarred];
}

-(id)copyWithZone:(NSZone *)zone{
  id copy = [[[self class]alloc]init];
  if(copy){
    [copy set_id:[self._id copyWithZone:zone]];
    [copy set_name:[self._name copyWithZone:zone]];
    [copy set_created:[self._created copyWithZone:zone]];
    [copy set_hash:self._hash];
    [copy set_isDecrypted:self._isDecrypted];
    [copy set_isStarred:self._isStarred];
  }
  return copy;
}

- (NSDictionary *)toDictionary {
  NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionary];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString:_id]
                       forKey:BucketContract.ID];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString:_name]
                       forKey:BucketContract.NAME];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString:_created]
                       forKey:BucketContract.CREATED];
  [resultDictionary setObject: @(_hash) forKey:BucketContract.HASH_CODE];
  [resultDictionary setObject: @(_isDecrypted) forKey:BucketContract.DECRYPTED];
  [resultDictionary setObject: @(_isStarred) forKey:BucketContract.STARRED];
  return resultDictionary;
}

@end
