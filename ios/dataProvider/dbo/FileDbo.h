//
//  FileDbo.h
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "IConvertibleToJS.h"
@class FileModel;

@interface FileDbo : NSObject<IConvertibleToJS, NSCopying> {
  
  NSString *_bucketId;
  NSString *_created;
  NSString *_erasure;
  NSString *_hmac;
  NSString *_fileId;
  NSString *_index;
  NSString *_mimeType;
  NSString *_name;
  long _size;
  BOOL _isDecrypted;
  BOOL _isStarred;
  BOOL _isSynced;
}
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

+(FileDbo *) fileDboFromFileModel: (FileModel *) model;

-(instancetype) initWithFileModel: (FileModel *) model;

-(instancetype) initWithBucketId: (NSString *) bucketId
                         created: (NSString *) created
                         erasure: (NSString *) erasure
                           hmac : (NSString *) hmac
                          fileId: (NSString *) fileId
                           index: (NSString *) index
                        mimeType: (NSString *)mimeType
                            name: (NSString *) name
                            size: (long) size
                     isDecrypted: (BOOL) isDecrypted
                       isStarred: (BOOL) isStarred
                        isSynced: (BOOL) isSynced
                   downloadState: (int) downloadState
                      fileHandle: (long) fileHandle
                         fileUri: (NSString *) fileUri
                       thumbnail: (NSString *) thumbnail;

-(FileModel *) toModel;

@end
