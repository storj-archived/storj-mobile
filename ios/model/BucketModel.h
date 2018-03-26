//
//  BucketModel.h
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "IConvertibleToJS.h"
#import "DictionaryUtils.h"
#import "StorjLibIos.h"
//#import "storj.h"
@import StorjIOS;

#define BUCKET_MODEL_ID "id"
#define BUCKET_MODEL_NAME "name"
#define BUCKET_MODEL_CREATED "created"
#define BUCKET_MODEL_HASH "hash"
#define BUCKET_MODEL_IS_DECRYPTED "isDecrypted"
#define BUCKET_MODEL_IS_STARRED "isStarred"

@interface BucketModel : NSObject<IConvertibleToJS>

@property (nonatomic, strong) NSString * _id;
@property (nonatomic, strong) NSString * _name;
@property (nonatomic, strong) NSString * _created;
@property long _hash;
@property BOOL _isDecrypted;
@property BOOL _isStarred;

-(instancetype) initWithStorjBucketModel: (SJBucket *) sjBucket;

-(instancetype) initWithId: (NSString *) bucketId
                      name: (NSString *) bucketName
                   created: (NSString *) created
                      hash: (long) hash
               isDecrypted: (BOOL) isDecrypted;

-(instancetype) initWithId: (NSString *) bucketId
                      name: (NSString *) bucketName
                   created: (NSString *) created
                      hash: (long) hash
               isDecrypted: (BOOL) isDecrypted
                 isStarred: (BOOL) isStarred;

-(BOOL) isValid;

@end
