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
@property (readwrite, assign) int _id;
@property (readwrite, assign) NSString *fileName;
@property (readwrite, assign) NSString *localPath;
@property (readwrite, assign) int status;
@property (readwrite, assign) int errorCode;
@property (readwrite, assign) long size;
@property (readwrite, assign) int count;
@property (readwrite, assign) NSString *creationDate;
@property (readwrite, assign) NSString *bucketId;
@property (readwrite, assign) long fileHandle;

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
