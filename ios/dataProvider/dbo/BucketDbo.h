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

@interface BucketDbo : NSObject<IConvertibleToJS>

+(BucketDbo *) bucketDboFromBucketModel: (BucketModel *) model;

-(void) setProp: (NSString *) propName
     fromString: (NSString *) propValue;

-(void) setProp: (NSString *) propName
       fromBool: (BOOL) propValue;

-(void) setProp: (NSString *) propName
       fromLong: (long) propValue;

-(NSString *) getId;

-(BucketModel *) toModel;
@end
