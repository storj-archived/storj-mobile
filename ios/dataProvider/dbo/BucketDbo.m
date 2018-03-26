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
NSString * _id;
NSString * _name;
NSString * _created;
long _hash;
BOOL _isDecrypted;
BOOL _isStarred;

+(BucketDbo *)bucketDboFromBucketModel:(BucketModel *)model{
  BucketDbo *dbo = [[BucketDbo alloc] init];
  [dbo setProp : BucketContract.ID fromString : [model _id]];
  [dbo setProp : BucketContract.NAME fromString : [model _name]];
  [dbo setProp : BucketContract.CREATED fromString : [model _created]];
  [dbo setProp : BucketContract.HASH_CODE fromLong : [model _hash]];
  [dbo setProp : BucketContract.DECRYPTED fromBool : [model _isDecrypted]];
  [dbo setProp : BucketContract.STARRED fromBool : [model _isStarred]];
  return dbo;
}

-(void) setProp: (NSString *) propName
     fromString: (NSString *) propValue
{
  if(!propName) {
    return;
  }
  if([propName isEqualToString:BucketContract.CREATED]){
    _created = propValue;
  }
  if([propName isEqualToString:BucketContract.NAME]){
    _name = propValue;
  }
  if([propName isEqualToString:BucketContract.ID]){
    _id = propValue;
  }
}

-(void) setProp: (NSString *) propName
       fromBool: (BOOL) propValue
{
  if(!propName) {
    return;
  }
  if([propName isEqualToString:BucketContract.DECRYPTED]){
    _isDecrypted = propValue;
  }
  if([propName isEqualToString:BucketContract.STARRED]){
    _isStarred = propValue;
  }
}

-(void) setProp: (NSString *) propName
       fromLong: (long) propValue
{
  if(!propName) {
    return;
  }
  if([propName isEqualToString:BucketContract.HASH_CODE]){
    _hash = propValue;
  }
}

-(NSString *) getId
{
  return _id;
}

-(BucketModel *)toModel{
  return [[BucketModel alloc] initWithId:_id
                             name:_name
                          created:_created
                             hash:_hash
                      isDecrypted:_isDecrypted
                        isStarred:_isStarred];
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
