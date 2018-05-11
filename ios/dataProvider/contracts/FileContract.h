//
//  FileContract.h
//  StorjMobile
//
//  Created by Barterio on 3/15/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface FileContract : NSObject

@property (readonly, class) NSString *const TABLE_NAME;
//@property (readonly, class) NSString *const ID;
@property (readonly, class) NSString *const FILE_ID;
@property (readonly, class) NSString *const NAME;
@property (readonly, class) NSString *const MIME_TYPE;
@property (readonly, class) NSString *const INDEX;
@property (readonly, class) NSString *const HMAC;
@property (readonly, class) NSString *const ERASURE;
@property (readonly, class) NSString *const CREATED;
@property (readonly, class) NSString *const DECRYPTED;
@property (readonly, class) NSString *const SIZE;
@property (readonly, class) NSString *const STARRED;
@property (readonly, class) NSString *const SYNCED;
@property (readonly, class) NSString *const DOWNLOAD_STATE;
@property (readonly, class) NSString *const FILE_HANDLE;
@property (readonly, class) NSString *const FILE_URI;
@property (readonly, class) NSString *const FILE_THUMBNAIL;

@property (readonly, class) NSString *const FILE_FK;

+(NSString *) createTable;

@end
