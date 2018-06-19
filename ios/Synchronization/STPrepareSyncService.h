//
//  STPrepareSyncService.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 6/4/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

@interface STPrepareSyncService : NSObject

-(instancetype) init;

-(NSArray *) prepareSyncQueue;

-(NSArray *) getSyncQueue;

@end
