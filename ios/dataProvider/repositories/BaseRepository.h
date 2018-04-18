//
//  BaseRepository.h
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ListResponse.h"
#import "SingleResponse.h"
#import "Response.h"
#import "FMDB.h"

@interface BaseRepository : NSObject

@property (nonatomic, strong) FMDatabase * _database;
//@property

-(instancetype) initWithDB: (FMDatabase *) database;

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
