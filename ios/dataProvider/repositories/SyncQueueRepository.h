//
//  SyncQueueRepository.h
//  StorjMobile
//
//  Created by Developer Mac on 31.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
#import "BaseRepository.h"
#import "STSyncQueueEntryModel.h"
#import "SyncQueueEntryDbo.h"

@class Response;

#ifndef SyncQueueRepository_h
#define SyncQueueRepository_h

@interface SyncQueueRepository : BaseRepository

-(instancetype) init;

-(NSArray *) getAll;

-(STSyncQueueEntryModel *) getById: (int) _id;

-(STSyncQueueEntryModel *) getByLocalPath: (NSString *) localPath
                               bucketId: (NSString *) bucketId;

-(Response *) insertWithModel: (STSyncQueueEntryModel *) model;

-(Response *) updateWithModel: (STSyncQueueEntryModel *) model;

-(Response *) deleteById: (int) _id;

@end

#endif /* SyncQueueRepository_h */
