//
//  STSyncScheduler.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 6/18/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

@interface STSyncScheduler : NSObject

+(instancetype) sharedInstance;

-(void) scheduleSync;

-(void) startSyncDelayed;

-(void) cancelSchedule;

@end
