//
//  UploadFileContract.h
//  StorjMobile
//
//  Created by Barterio on 3/15/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface UploadFileContract : NSObject

@property (readonly, class) NSString *const TABLE_NAME;
@property (readonly, class) NSString *const ID;
@property (readonly, class) NSString *const FILE_HANDLE;
@property (readonly, class) NSString *const NAME;
@property (readonly, class) NSString *const URI;
@property (readonly, class) NSString *const PROGRESS;
@property (readonly, class) NSString *const SIZE;
@property (readonly, class) NSString *const UPLOADED;
@property (readonly, class) NSString *const BUCKET_ID;

+(NSString *)createTable;

@end
