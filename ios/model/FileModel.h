//
//  FileModel.h
//  StorjMobile
//
//  Created by Barterio on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "IConvertibleToJS.h"
#import "DictionaryUtils.h"
#import "FileDbo.h"
@import StorjIOS;


#define FILE_MODEL_BUCKET_ID "bucketId"
#define FILE_MODEL_INDEX "index"

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
@property int _downloadState;
@property long _fileHandle;
@property (nonatomic, strong) NSString *_fileUri;
@property (nonatomic, strong) NSString *_thumbnail;

-(instancetype) initWithBucketId: (NSString *) bucketId
                         created: (NSString *) created
                         erasure: (NSString *) erasure
                            hmac: (NSString *) hmac
                          fileId: (NSString *) fileId
                           index: (NSString *) index
                        mimeType: (NSString *) mimeType
                            name: (NSString *) name
                            size: (long) size
                     isDecrypted: (BOOL) isDecrypted;

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
                        isSynced: (BOOL) isSynced
                   downloadState: (int) downloadState
                         fileUri: (NSString *) fileUri
                       thumbnail: (NSString *) thumbnail;

-(instancetype) initWithSJFile: (SJFile *) sjFile;

-(instancetype) initWithSJFile: (SJFile *) sjFile starred: (BOOL) isStarred;

-(instancetype) initWithSJFile: (SJFile *) sjFile starred: (BOOL) isStarred synced: (BOOL) isSynced;

-(instancetype) initWithSJFile: (SJFile *) sjFile starred: (BOOL) isStarred synced: (BOOL) isSynced downloadState: (int) downloadState fileHandle: (long) fileHandle fileUri: (NSString *) fileUri thumbnail: (NSString *) thumbnail;

-(instancetype) initWithFileDbo: (FileDbo *) dbo;

-(BOOL)isValid;

@end
