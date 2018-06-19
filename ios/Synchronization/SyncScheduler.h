//
//  SyncScheduler.h
//  StorjMobile
//
//  Created by Barterio on 6/18/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

@interface SyncScheduler : NSObject

+(instancetype) sharedInstance;

-(void) scheduleSync;

@end
