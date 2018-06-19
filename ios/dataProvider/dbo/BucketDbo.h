//
//  BucketDbo.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
#import "IConvertibleToJS.h"

@class STBucketModel;
@class BucketContract;

@interface BucketDbo : NSObject<IConvertibleToJS, NSCopying> {
  NSString *_id;
  NSString * _name;
  NSString * _created;
  long _hash;
  BOOL _isDecrypted;
  BOOL _isStarred;
}
@property (nonatomic, strong, getter=getId) NSString *_id;
@property (nonatomic, strong, getter=name)NSString * _name;
@property (nonatomic, strong, getter=created)NSString * _created;
@property (getter=hash)long _hash;
@property (getter=isDecrypted)BOOL _isDecrypted;
@property (getter=isStarred)BOOL _isStarred;

+(BucketDbo *) bucketDboFromBucketModel: (STBucketModel *) model;

-(instancetype) initWithId: (NSString *) modelId
                      name: (NSString *) name
                   created: (NSString *) created
                      hash: (long) hash
               isDecrypted: (BOOL) isDecrypted
                 isStarred: (BOOL) isStarred;

-(instancetype) initWithBucketModel: (STBucketModel *) model;

-(STBucketModel *) toModel;
@end
