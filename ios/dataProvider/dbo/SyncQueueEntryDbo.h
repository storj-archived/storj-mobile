//
//  SynchronizationQueueEntryDbo.h
//  StorjMobile
//
//  Created by Developer Mac on 31.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

#ifndef SynchronizationQueueEntryDbo_h
#define SynchronizationQueueEntryDbo_h

@interface SyncQueueEntryDbo : NSObject

@property (readwrite) int _id;
@property (readwrite, strong) NSString *fileName;
@property (readwrite, strong) NSString *localPath;
@property (readwrite) int status;
@property (readwrite) int errorCode;
@property (readwrite) long size;
@property (readwrite) int count;
@property (readwrite, strong) NSString *creationDate;
@property (readwrite, strong) NSString *bucketId;
@property (readwrite) long fileHandle;

-(instancetype) init;

-(instancetype) initWithId: (int) _id
                  fileName: (NSString *) fileName
                 localPath: (NSString *) localPath
                    status: (int) status
                 errorCode: (int) errorCode
                      size: (long) size
                     count: (int) count
              creationDate: (NSString *) creationDate
                  bucketId:(NSString *) bucketId
                fileHandle: (long) fileHandle;

@end

#endif /* SynchronizationQueueEntryDbo_h */
