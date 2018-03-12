//
//  DatabaseFactory.h
//  StorjMobile
//
//  Created by Barterio on 3/12/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <sqlite3.h>

#define DATABASE_NAME "storj.db"

@interface DatabaseFactory : NSObject{
  NSString *databasePath;
}

+(DatabaseFactory *) getSharedDatabaseFactory;
-(BOOL) createDatabase;
-(BOOL) saveData:(NSString *) tableName andDictionary:(NSDictionary *) data;
-(NSDictionary *) getData;
@end
