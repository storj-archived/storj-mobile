//
//  DatabaseFactory.h
//  StorjMobile
//
//  Created by Bohdan Artemenko on 3/12/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

@class FMDatabase;

#define DATABASE_NAME "storj.db"

@interface DatabaseFactory : NSObject{
  NSString *databasePath;
}

+(DatabaseFactory *) getSharedDatabaseFactory;

-(FMDatabase *) getSharedDb;

-(NSString *)getDBPath;

@end
