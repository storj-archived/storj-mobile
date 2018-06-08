//
//  SyncQueueEntryModel.h
//  StorjMobile
//
//  Created by Developer Mac on 31.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
#import "IConvertibleToJS.h"

@class SyncQueueEntryDbo;

#ifndef SyncQueueEntryModel_h
#define SyncQueueEntryModel_h

@interface SyncQueueEntryModel: NSObject<IConvertibleToJS>

@property (readonly) int _id;
@property (readonly, strong) NSString *fileName;
@property (readonly, strong) NSString *localPath;
@property (readonly, strong) NSString *localIdentifier;
@property (readonly) int status;
@property (readonly) int errorCode;
@property (readonly) long size;
@property (readonly) int count;
@property (readonly, strong) NSString *creationDate;
@property (readonly, strong) NSString *bucketId;
@property (readonly) long fileHandle;

-(instancetype) init;

-(instancetype) initWithId: (int) _id
                  fileName: (NSString *) fileName
                 localPath: (NSString *) localPath
           localIdentifier: (NSString *) localIdentifier
                    status: (int) status
                 errorCode: (int) errorCode
                      size: (long) size
                     count: (int) count
              creationDate: (NSString *) creationDate
                  bucketId: (NSString *) bucketId
                fileHandle: (long) fileHandle;

-(BOOL) isValid;

-(instancetype) initWithDbo: (SyncQueueEntryDbo *) dbo;

-(SyncQueueEntryDbo *) toDbo;

@end
#endif /* SyncQueueEntryModel_h */
