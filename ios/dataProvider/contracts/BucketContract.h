//
//  BucketContract.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/15/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

@interface BucketContract : NSObject

@property (readonly, class) NSString *const TABLE_NAME;
@property (readonly, class) NSString *const ID;
@property (readonly, class) NSString *const NAME;
@property (readonly, class) NSString *const CREATED;
@property (readonly, class) NSString *const DECRYPTED;
@property (readonly, class) NSString *const HASH_CODE;
@property (readonly, class) NSString *const STARRED;

+(NSString *)createTable;

@end
