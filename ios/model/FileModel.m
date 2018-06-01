//
//  FileModel.m
//  StorjMobile
//
//  Created by Barterio on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "FileModel.h"
#import "FileContract.h"
#import "FileDbo.h"
#import "DictionaryUtils.h"


@implementation FileModel

@synthesize _bucketId;
@synthesize _fileId;
@synthesize _created;
@synthesize _name;
@synthesize _hmac;
@synthesize _index;
@synthesize _erasure;
@synthesize _mimeType;
@synthesize _size;
@synthesize _isDecrypted;
@synthesize _isStarred;
@synthesize _isSynced;
 @synthesize _downloadState;
@synthesize _fileHandle;
@synthesize _fileUri;
@synthesize _thumbnail;

-(instancetype)initWithBucketId:(NSString *)bucketId
                        created:(NSString *)created
                        erasure:(NSString *)erasure
                           hmac:(NSString *)hmac
                         fileId:(NSString *)fileId
                          index:(NSString *)index
                       mimeType:(NSString *)mimeType
                           name:(NSString *)name
                           size:(long)size
                    isDecrypted:(BOOL)isDecrypted
                      isStarred:(BOOL)isStarred {
  
  return [self initWithBucketId:bucketId
                        created:created
                        erasure:erasure
                           hmac:hmac
                         fileId:fileId
                          index:index
                       mimeType:mimeType
                           name:name
                           size:size
                    isDecrypted:isDecrypted
                      isStarred:isStarred
                       isSynced:NO];
}

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
                      fileHandle: (long) fileHandle
                         fileUri: (NSString *) fileUri
                       thumbnail: (NSString *) thumbnail {
  if(self = [super init]) {
    _bucketId = bucketId;
    _created = created;
    _erasure = erasure;
    _hmac = hmac;
    _fileId = fileId;
    _index = index;
    _mimeType = mimeType;
    _name = name;
    _size = size;
    _isDecrypted = isDecrypted;
    _isStarred = isStarred;
    _isSynced = isSynced;
    _downloadState = downloadState;
    _fileHandle = fileHandle;
    _fileUri = fileUri;
    _thumbnail = thumbnail;
  }
  
  return self;
}

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
                       thumbnail: (NSString *) thumbnail {
  
  return [self initWithBucketId: _bucketId
                        created: _created
                        erasure: _erasure
                           hmac: _hmac
                         fileId: _fileId
                          index: _index
                       mimeType: _mimeType
                           name: _name
                           size: _size
                    isDecrypted: _isDecrypted
                      isStarred: _isStarred
                       isSynced: _isSynced
                  downloadState: _downloadState
                     fileHandle: _fileHandle
                        fileUri: _fileUri
                      thumbnail: _thumbnail];
}

-(instancetype) initWithSJFile: (SJFile *) sjFile {
  
  return [self initWithSJFile: sjFile
                      starred: NO
                       synced: NO
                downloadState: 0
                   fileHandle: 0
                      fileUri: nil
                    thumbnail: nil];
}

-(instancetype) initWithSJFile: (SJFile *) sjFile
                       starred: (BOOL) isStarred {
  
  return [self initWithSJFile: sjFile
                      starred: isStarred
                       synced: NO
                downloadState: 0
                   fileHandle: 0
                      fileUri: nil
                    thumbnail: nil];
}

-(instancetype) initWithSJFile: (SJFile *) sjFile
                       starred: (BOOL) isStarred
                        synced: (BOOL) isSynced {
  
  return [self initWithSJFile: sjFile
                      starred: isStarred
                       synced: isSynced
                downloadState: 0
                   fileHandle: 0
                      fileUri: nil
                    thumbnail: nil];
}

-(instancetype) initWithSJFile: (SJFile *) sjFile
                       starred: (BOOL) isStarred
                        synced: (BOOL) isSynced
                 downloadState: (int) downloadState
                    fileHandle: (long) fileHandle
                       fileUri: (NSString *) fileUri
                     thumbnail: (NSString *) thumbnail {
  
  return [self initWithBucketId: [sjFile _bucketId]
                        created: [sjFile _created]
                        erasure: [sjFile _erasure]
                           hmac: [sjFile _hmac]
                         fileId: [sjFile _fileId]
                          index: [sjFile _index]
                       mimeType: [sjFile _mimeType]
                           name: [sjFile _name]
                           size: [sjFile _size]
                    isDecrypted: [sjFile _isDecrypted]
                      isStarred: isStarred
                       isSynced: isSynced
                  downloadState: downloadState
                     fileHandle: fileHandle
                        fileUri: fileUri
                      thumbnail: thumbnail];
}

-(instancetype) initWithFileDbo: (FileDbo *) dbo {
  
  return [self initWithBucketId: [dbo _bucketId]
                        created: [dbo _created]
                        erasure: [dbo _erasure]
                           hmac: [dbo _hmac]
                         fileId: [dbo _fileId]
                          index: [dbo _index]
                       mimeType: [dbo _mimeType]
                           name: [dbo _name]
                           size: [dbo _size]
                    isDecrypted: [dbo _isDecrypted]
                      isStarred: [dbo _isStarred]
                       isSynced: [dbo _isSynced]
                  downloadState: [dbo _downloadState]
                     fileHandle: [dbo _fileHandle]
                        fileUri: [dbo _fileUri]
                      thumbnail: [dbo _thumbnail]];
}

-(BOOL) isValid {
  
  return [DictionaryUtils isNSStringValid: _bucketId]
  && [DictionaryUtils isNSStringValid: _created]
  && [DictionaryUtils isNSStringValid: _hmac]
  && [DictionaryUtils isNSStringValid: _fileId]
  && [DictionaryUtils isNSStringValid: _mimeType]
  && [DictionaryUtils isNSStringValid: _name];
}

- (NSDictionary *)toDictionary {
  NSMutableDictionary *object = [[NSMutableDictionary alloc] init];
  
  [object setObject: [DictionaryUtils checkAndReturnNSString: _bucketId]
             forKey: @FILE_MODEL_BUCKET_ID];
  [object setObject: [DictionaryUtils checkAndReturnNSString: _created]
             forKey: FileContract.CREATED];
  [object setObject: [DictionaryUtils checkAndReturnNSString: _erasure]
             forKey: FileContract.ERASURE];
  [object setObject: [DictionaryUtils checkAndReturnNSString: _hmac]
             forKey: FileContract.HMAC];
  [object setObject: [DictionaryUtils checkAndReturnNSString: _fileId]
             forKey: FileContract.FILE_ID];
  [object setObject: [DictionaryUtils checkAndReturnNSString: _index]
             forKey:@FILE_MODEL_INDEX];
  [object setObject: [DictionaryUtils checkAndReturnNSString: _mimeType]
             forKey: FileContract.MIME_TYPE];
  [object setObject: [DictionaryUtils checkAndReturnNSString: _name]
             forKey: FileContract.NAME];
  [object setObject: @(_size)
             forKey: FileContract.SIZE];
  [object setObject: @(_isDecrypted)
             forKey: FileContract.DECRYPTED];
  if(_isStarred) {
    [object setObject: @(_isStarred)
               forKey: FileContract.STARRED];
  }
  [object setObject: @(_downloadState)
             forKey: FileContract.DOWNLOAD_STATE];
  [object setObject: @(_fileHandle)
             forKey: FileContract.FILE_HANDLE];
  [object setObject: [DictionaryUtils checkAndReturnNSString: _fileUri]
             forKey: FileContract.FILE_URI];
  [object setObject: [DictionaryUtils checkAndReturnNSString: _thumbnail]
             forKey: FileContract.FILE_THUMBNAIL];
  
  return object;
}

@end
