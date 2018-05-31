//
//  SyncQueueEntryModel.m
//  StorjMobile
//
//  Created by Developer Mac on 31.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SyncQueueEntryModel.h"

@implementation SyncQueueEntryModel

-(instancetype) init
{
    return [super init];
}

-(instancetype) initWithId: (int) _id
                  fileName: (NSString *) fileName
                 localPath: (NSString *) localPath
                    status: (int) status
                 errorCode: (int) errorCode
                      size: (long) size
                     count: (int) count
              creationDate: (NSString *) creationDate
                  bucketId: (NSString *) bucketId
                fileHandle: (long) fileHandle
{
    if(self = [super init])
    {
        __id = _id;
        _fileName = fileName;
        _localPath = localPath;
        _status = status;
        _errorCode = errorCode;
        _size = size;
        _count = count;
        _creationDate = creationDate;
        _bucketId = bucketId;
        _fileHandle = fileHandle;
    }
    
    return self;
}

-(instancetype) initWithDbo: (SyncQueueEntryDbo *) dbo
{
    return [self initWithId: dbo._id fileName: dbo.fileName localPath: dbo.localPath status: dbo.status errorCode: dbo.errorCode size: dbo.size count: dbo.count creationDate: dbo.creationDate bucketId: dbo.bucketId fileHandle: dbo.fileHandle];
}

-(SyncQueueEntryDbo *) toDbo
{
    return [[SyncQueueEntryDbo alloc] initWithId: (int) __id fileName: (NSString *) _fileName localPath: (NSString *) _localPath status: (int) _status errorCode:(int) _errorCode size: (long) _size count: (int) _count creationDate: (NSString *) _creationDate bucketId: (NSString *) _bucketId fileHandle: (long) _fileHandle];
}

-(BOOL) isValid
{
  return _fileName.length > 0
          && _localPath.length > 0
          && _bucketId.length > 0;
}

- (NSDictionary *)toDictionary
{
    NSMutableDictionary *object = [[NSMutableDictionary alloc] init];
    
    [object setObject: @(__id)
               forKey: SynchronizationQueueContract.ID];
    [object setObject: [DictionaryUtils checkAndReturnNSString: _fileName]
               forKey: SynchronizationQueueContract.FILE_NAME];
    [object setObject: [DictionaryUtils checkAndReturnNSString: _localPath]
               forKey: SynchronizationQueueContract.LOCAL_PATH];
    [object setObject: @(_status)
               forKey: SynchronizationQueueContract.STATUS];
    [object setObject: @(_errorCode)
               forKey: SynchronizationQueueContract.ERROR_CODE];
    [object setObject: @(_size)
               forKey: SynchronizationQueueContract.SIZE];
    [object setObject: @(_count)
               forKey: SynchronizationQueueContract.COUNT];
    [object setObject: [DictionaryUtils checkAndReturnNSString: _creationDate]
               forKey: SynchronizationQueueContract.CREATION_DATE];
    [object setObject: [DictionaryUtils checkAndReturnNSString: _bucketId]
               forKey: SynchronizationQueueContract.BUCKET_ID];
    [object setObject: @(_fileHandle)
               forKey: SynchronizationQueueContract.FILE_HANDLE];
    
    
    return object;
}

@end
