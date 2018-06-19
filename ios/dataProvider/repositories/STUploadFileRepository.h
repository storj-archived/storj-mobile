//
//  STUploadFileRepository.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "BaseRepository.h"
#import "UploadFileDbo.h"
#import "STUploadFileModel.h"

@interface STUploadFileRepository : BaseRepository

-(instancetype) init;

-(NSArray *) getAll;

-(NSArray *) getAllWithOrderByColumn: (NSString *) columnName
                               order:(BOOL) isDescending;

-(STUploadFileModel *) getByFileId:(NSString *) fileId;

-(UploadFileDbo *) getByColumnName:(NSString *) columnName
                 columnValue:(NSString *) columnValue;

-(Response *) insertWithModel: (STUploadFileModel *) model;

-(Response *) deleteByModel: (STUploadFileModel *) model;

-(Response *) deleteById: (NSString *) fileId;

-(Response *) deleteByIds: (NSArray *) fileIds;

-(Response *) deleteAll;

//-(Response *) deleteAllFromBucket:(NSString *) bucketId;

-(Response *) updateByModel: (STUploadFileModel *) model;

@end
