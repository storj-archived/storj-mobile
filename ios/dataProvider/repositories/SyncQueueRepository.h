//
//  SyncQueueRepository.h
//  StorjMobile
//
//  Created by Developer Mac on 31.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//
#import "BaseRepository.h"
#import "Response.h"
#import "SyncQueueEntryModel.h"
#import "SyncQueueEntryDbo.h"
#import "SynchronizationQueueContract.h"

#ifndef SyncQueueRepository_h
#define SyncQueueRepository_h

@interface SyncQueueRepository : BaseRepository

-(instancetype) init;

-(NSArray *) getAll;

-(SyncQueueEntryModel *) getById: (int) _id;

-(SyncQueueEntryModel *) getByLocalPath: (NSString *) localPath
                               bucketId: (NSString *) bucketId;

-(Response *) insertWithModel: (SyncQueueEntryModel *) model;

-(Response *) updateWithModel: (SyncQueueEntryModel *) model;

-(Response *) deleteById: (int) _id;

@end

#endif /* SyncQueueRepository_h */
