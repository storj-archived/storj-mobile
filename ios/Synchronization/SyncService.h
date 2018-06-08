//
//  SyncService.h
//  StorjMobile
//
//  Created by Barterio on 6/4/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SyncService : NSObject

-(void) startSync;

-(void) stopSync;

-(void) clean;

@end
