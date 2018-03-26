//
//  DatabaseFactory.h
//  StorjMobile
//
//  Created by Barterio on 3/12/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FMDB.h"
#import "BucketContract.h"
#import "FileContract.h"
#import "UploadFileContract.h"

#define DATABASE_NAME "storj.db"

@interface DatabaseFactory : NSObject{
  NSString *databasePath;
}

+(DatabaseFactory *) getSharedDatabaseFactory;
-(BOOL) createDatabase;

-(FMDatabase *) getSharedDb;
@end
