//
//  FileRepository.h
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "BaseRepository.h"
#import "FileModel.h"
#import "FileDbo.h"

@interface FileRepository : BaseRepository

-(instancetype) initWithDB:(FMDatabase *)database;

-(NSArray *) getAllFromBucket: (NSString *) bucketId;

-(NSArray *) getAll;

-(NSArray *) getAllWithOrderByColumn: (NSString *) columnName
                               order:(BOOL) isDescending;

-(NSArray *) getStarred;

-(FileDbo *) getByFileId:(NSString *) fileId;

-(FileDbo *) getByColumnName:(NSString *) columnName
                   columnValue:(NSString *) columnValue;

-(Response *) insertWithModel: (FileModel *) model;

-(Response *) deleteByModel: (FileModel *) model;

-(Response *) deleteById: (NSString *) fileId;

-(Response *) deleteByIds: (NSArray *) fileIds;

-(Response *) deleteAll;

-(Response *) deleteAllFromBucket:(NSString *) bucketId;

-(Response *) updateByModel: (FileModel *) model;

-(Response *) updateById:(NSString *)fileId
                 starred:(BOOL) isStarred;

@end
