//
//  STBucketRepository.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
#import "BaseRepository.h"

#import "BucketDbo.h"
#import "STBucketModel.h"
@class Response;

@interface STBucketRepository : BaseRepository

-(instancetype) init;

-(NSArray *) getAll;

-(NSArray *) getAllWithOrderByColumn: (NSString *) columnName
                               order:(BOOL) isDescending;

-(NSArray *) getStarred;

-(BucketDbo *) getByBucketId:(NSString *) bucketId;

-(BucketDbo *) getBucketByBucketName: (NSString *) bucketName;

-(BucketDbo *) getByColumnName:(NSString *) columnName
                   columnValue:(NSString *) columnValue;

-(Response *) insertWithModel: (STBucketModel *) model;

-(Response *) deleteByModel: (STBucketModel *) model;

-(Response *) deleteById: (NSString *) bucketId;

-(Response *) deleteByIds: (NSArray *) bucketIds;

-(Response *) deleteAll;

-(Response *) updateByModel: (STBucketModel *) model;

-(Response *) updateById:(NSString *)bucketId
                 starred:(BOOL) isStarred;

@end
