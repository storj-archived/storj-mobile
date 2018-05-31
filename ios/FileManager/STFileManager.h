//
//  STFileManager.h
//  StorjMobile
//
//  Created by Developer Mac on 30.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>

#ifndef STFileManager_h
#define STFileManager_h

@interface STFileManager : NSObject

-(instancetype) init;

-(NSMutableArray *) getAssetsFromGallery;

@end

#endif /* STFileManager_h */
