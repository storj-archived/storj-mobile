//
//  BucketDbo.h
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "IConvertibleToJS.h"
#import "BucketModel.h"
#import "BucketContract.h"

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
@property long _hash;
@property BOOL _isDecrypted;
@property BOOL _isStarred;

+(BucketDbo *) bucketDboFromBucketModel: (BucketModel *) model;

-(instancetype) initWithId: (NSString *) modelId
                      name: (NSString *) name
                   created: (NSString *) created
                      hash: (long) hash
               isDecrypted: (BOOL) isDecrypted
                 isStarred: (BOOL) isStarred;

-(instancetype) initWithBucketModel: (BucketModel *) model;

-(BucketModel *) toModel;
@end
