//
//  FileDbo.m
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "FileDbo.h"
#import "STFileModel.h"
#import "FileContract.h"
#import "DictionaryUtils.h"

@implementation FileDbo

@synthesize _bucketId, _created, _erasure, _fileId, _hmac, _index, _isDecrypted, _isStarred,
_isSynced, _mimeType, _name, _size, _downloadState, _fileHandle, _fileUri, _thumbnail;

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

-(instancetype) initWithFileModel: (STFileModel *) model {
  return [self initWithBucketId: [model _bucketId ]
                        created: [model _created]
                        erasure: [model _erasure]
                           hmac: [model _hmac]
                         fileId: [model _fileId]
                          index: [model _index]
                       mimeType: [model _mimeType]
                           name: [model _name]
                           size: [model _size]
                    isDecrypted: [model _isDecrypted]
                      isStarred: [model _isStarred]
                       isSynced: [model _isSynced]
                  downloadState: [model _downloadState]
                     fileHandle: [model _fileHandle]
                        fileUri: [model _fileUri]
                      thumbnail: [model _thumbnail]];
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

- (NSDictionary *)toDictionary {
  NSMutableDictionary *resultDictionary = [NSMutableDictionary dictionary];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString: _bucketId]
                       forKey: FileContract.FILE_FK];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString: _created]
                       forKey: FileContract.CREATED];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString: _erasure]
                       forKey: FileContract.ERASURE];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString: _hmac]
                       forKey: FileContract.HMAC];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString: _fileId]
                       forKey: FileContract.FILE_ID];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString: _index]
                       forKey: FileContract.INDEX];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString: _mimeType]
                       forKey: FileContract.MIME_TYPE];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString: _name]
                       forKey: FileContract.NAME];
  [resultDictionary setObject: @(_size) forKey: FileContract.SIZE];
  [resultDictionary setObject: @(_isDecrypted) forKey: FileContract.DECRYPTED];
  [resultDictionary setObject: @(_isStarred) forKey: FileContract.STARRED];
  [resultDictionary setObject: @(_isSynced) forKey: FileContract.SYNCED];
  [resultDictionary setObject: @(_downloadState) forKey: FileContract.DOWNLOAD_STATE];
  [resultDictionary setObject: @(_fileHandle) forKey: FileContract.FILE_HANDLE];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString: _fileUri]
                       forKey: FileContract.FILE_URI];
  [resultDictionary setObject: [DictionaryUtils checkAndReturnNSString: _thumbnail]
                       forKey: FileContract.FILE_THUMBNAIL];
  
  return resultDictionary;
}

+(FileDbo *)fileDboFromFileModel:(STFileModel *)model {
  
  return [[FileDbo alloc] initWithFileModel:model];
}

-(STFileModel *) toModel {
  
  return [[STFileModel alloc] initWithBucketId: _bucketId
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
                                     fileUri: _fileUri
                                   thumbnail: _thumbnail];
}

- (nonnull id)copyWithZone: (nullable NSZone *) zone {
  id copy = [[[self class]alloc]init];
  if(copy) {
    [copy set_bucketId: [self._bucketId copyWithZone:  zone]];
    [copy set_created: [self._created copyWithZone: zone]];
    [copy set_erasure: [self._erasure copyWithZone: zone]];
    [copy set_hmac: [self._hmac copyWithZone: zone]];
    [copy set_fileId: [self._fileId copyWithZone: zone]];
    [copy set_index: [self._index copyWithZone: zone]];
    [copy set_mimeType: [self._mimeType copyWithZone: zone]];
    [copy set_name: [self._name copyWithZone: zone]];
    [copy set_size: self._size];
    [copy set_isDecrypted: self._isDecrypted];
    [copy set_isStarred: self._isStarred];
    [copy set_isSynced: self._isSynced];
    [copy set_downloadState: self._downloadState];
    [copy set_fileHandle: self._fileHandle];
    [copy set_fileUri: [self._fileUri copyWithZone: zone]];
    [copy set_thumbnail: [self._thumbnail copyWithZone: zone]];
  }
  
  return copy;
}

@end
