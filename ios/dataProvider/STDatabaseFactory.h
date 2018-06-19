//
//  STDatabaseFactory.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/12/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

@class FMDatabase;

#define DATABASE_NAME "storj.db"

@interface STDatabaseFactory : NSObject{
  NSString *databasePath;
}

+(STDatabaseFactory *) getSharedDatabaseFactory;

-(FMDatabase *) getSharedDb;

-(NSString *)getDBPath;

@end
