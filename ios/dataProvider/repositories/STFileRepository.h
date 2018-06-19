//
//  STFileRepository.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//



#import "BaseRepository.h"
#import "STFileModel.h"
#import "FileDbo.h"

@interface STFileRepository : BaseRepository

-(instancetype) init;

-(NSArray *) getAllFromBucket: (NSString *) bucketId;

-(NSArray *) getAll;

-(NSArray *) getAllWithOrderByColumn: (NSString *) columnName
                               order:(BOOL) isDescending;

-(NSArray *) getAllFromBucket:(NSString *)bucketId
                orderByColumn: (NSString *) columnName
                   descending: (BOOL) isDescending;

-(NSArray *) getStarred;

-(FileDbo *) getByFileId:(NSString *) fileId;

-(FileDbo *) getByColumnName:(NSString *) columnName
                   columnValue:(NSString *) columnValue;

-(Response *) insertWithModel: (STFileModel *) model;

-(Response *) deleteByModel: (STFileModel *) model;

-(Response *) deleteById: (NSString *) fileId;

-(Response *) deleteByIds: (NSArray *) fileIds;

-(Response *) deleteAll;

-(Response *) deleteAllFromBucket:(NSString *) bucketId;

-(Response *) updateByModel: (STFileModel *) model;

-(Response *) updateById:(NSString *)fileId
                 starred:(BOOL) isStarred;

-(Response *) updateById: (NSString *) fileId
           downloadState: (int) downloadState
              fileHandle: (long) fileHandle
                 fileUri: (NSString *) fileUri;

-(Response *) updateThumbnailWithFileId: (NSString *) fileId
                        thumbnailBase64: (NSString *) thumbnailBase64String;

@end
