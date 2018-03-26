//
//  FileModel.h
//  StorjMobile
//
//  Created by Barterio on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "IConvertibleToJS.h"
@import StorjIOS;

#define FILE_MODEL_BUCKET_ID "bucketId"
#define FILE_MODEL_CREATED "created"
#define FILE_MODEL_ERASURE "erasure"
#define FILE_MODEL_HMAC "hmac"
#define FILE_MODEL_FILE_ID "fileId"
#define FILE_MODEL_INDEX "index"
#define FILE_MODEL_MIME_TYPE "mimeType"
#define FILE_MODEL_NAME "name"
#define FILE_MODEL_SIZE "size"
#define FILE_MODEL_IS_DECRYPTED "isDecrypted"
#define FILE_MODEL_IS_STARRED "isStarred"
#define FILE_MODEL_IS_SYNCED "isSynced"

@interface FileModel : NSObject<IConvertibleToJS>

@property (nonatomic, strong) NSString *_bucketId;
@property (nonatomic, strong) NSString *_created;
@property (nonatomic, strong) NSString *_erasure;
@property (nonatomic, strong) NSString *_hmac;
@property (nonatomic, strong) NSString *_fileId;
@property (nonatomic, strong) NSString *_index;
@property (nonatomic, strong) NSString *_mimeType;
@property (nonatomic, strong) NSString *_name;
@property long _size;
@property BOOL _isDecrypted;
@property BOOL _isStarred;
@property BOOL _isSynced;

//TODO add constructor for Storj model;

-(instancetype) initWithBucketId: (NSString *) bucketId
                         created: (NSString *) created
                         erasure: (NSString *) erasure
                            hmac: (NSString *) hmac
                          fileId: (NSString *) fileId
                           index: (NSString *) index
                        mimeType: (NSString *) mimeType
                            name: (NSString *) name
                            size: (long) size
                     isDecrypted: (BOOL) isDecrypted
                       isStarred: (BOOL) isStarred;

-(instancetype) initWithBucketId: (NSString *) bucketId
                         created: (NSString *) created
                         erasure: (NSString *) erasure
                            hmac: (NSString *) hmac
                          fileId: (NSString *) fileId
                           index: (NSString *) index
                        mimeType: (NSString *) mimeType
                            name: (NSString *) name
                            size: (long) size
                     isDecrypted: (BOOL) isDecrypted
                       isStarred: (BOOL) isStarred
                        isSynced: (BOOL) isSynced;

//-(instancetype) initWithSJFile: (SJFile *) sjFile;

-(BOOL)isValid;

@end
