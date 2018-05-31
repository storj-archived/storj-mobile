//
//  SynchronizationQueueContract.h
//  StorjMobile
//
//  Created by Developer Mac on 31.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

#ifndef SynchronizationQueueContract_h
#define SynchronizationQueueContract_h

#import <Foundation/Foundation.h>

@interface SynchronizationQueueContract : NSObject

@property (readonly, class) NSString *const TABLE_NAME;
@property (readonly, class) NSString *const ID;

@property (readonly, class) NSString *const FILE_NAME;
@property (readonly, class) NSString *const LOCAL_PATH;
@property (readonly, class) NSString *const STATUS;
@property (readonly, class) NSString *const ERROR_CODE;
@property (readonly, class) NSString *const SIZE;
@property (readonly, class) NSString *const COUNT;
@property (readonly, class) NSString *const CREATION_DATE;
@property (readonly, class) NSString *const BUCKET_ID;
@property (readonly, class) NSString *const FILE_HANDLE;

+(NSString *) createTable;

@end

#endif /* SynchronizationQueueContract_h */
