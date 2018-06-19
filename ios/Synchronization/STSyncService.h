//
//  STSyncService.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 6/4/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

@interface STSyncService : NSObject

+(instancetype) sharedInstance;

-(void) startSync;

-(void) stopSync;

-(void) removeFileFromSyncQueue: (int) syncEntryId;

-(void) clean;

@end
