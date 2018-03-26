//
//  UploadFileRepository.h
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "BaseRepository.h"
@class UploadFileDbo;
@class UploadFileModel;

@interface UploadFileRepository : BaseRepository

-(instancetype) initWithDB:(FMDatabase *)database;

-(NSArray *) getAll;

-(NSArray *) getAllWithOrderByColumn: (NSString *) columnName
                               order:(BOOL) isDescending;

-(NSArray *) getStarred;

-(UploadFileDbo *) getByFileId:(NSString *) fileId;

-(UploadFileDbo *) getByColumnName:(NSString *) columnName
                 columnValue:(NSString *) columnValue;

-(Response *) insertWithModel: (UploadFileModel *) model;

-(Response *) deleteByModel: (UploadFileModel *) model;

-(Response *) deleteById: (NSString *) fileId;

-(Response *) deleteByIds: (NSArray *) fileIds;

-(Response *) deleteAll;

//-(Response *) deleteAllFromBucket:(NSString *) bucketId;

-(Response *) updateByModel: (UploadFileModel *) model;

@end
