//
//  BaseRepository.h
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
#import "FMDB.h"

@class Response;

@interface BaseRepository : NSObject

-(instancetype) init;

-(Response *) executeInsertIntoTable: (NSString *) tableName
                            fromDict: (NSDictionary *) dictionary;

-(Response *) executeDeleteFromTable:(NSString *)tableName
                       withObjectKey: (NSString *) objectKey
                    withObjecktValue: (NSString *) objectValue;

-(Response *) executeDeleteFromTable:(NSString *)tableName
                       withObjectKey: (NSString *) objectKey
                      withObjecktIds: (NSArray *) objectIds;

-(Response *) executeDeleteAllFromTable:(NSString *) tableName;

-(Response *) executeUpdateAtTable:(NSString *) tableName
                         objectKey:(NSString *) objectKey
                          objectId:(NSString *) objectId
//                 columnsDictionary:(NSDictionary *) columnsDictionary
                  updateDictionary:(NSDictionary *) updateDictionary;

-(FMDatabaseQueue *)readableQueue;
  
-(FMDatabaseQueue *)writableQueue;

+(NSString *) getWhereClauseWithColumnDictionary: (NSDictionary *)columnsDictionary
                                        objectId: (NSString *) objectId;


@end
