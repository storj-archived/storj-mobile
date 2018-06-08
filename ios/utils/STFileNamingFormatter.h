//
//  STFileNamingFormatter.h
//  StorjMobile
//
//  Created by Barterio on 6/4/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
@class STAssetFileModel;

@interface STFileNamingFormatter : NSObject

+(NSString *) fileNameWithSTAssetFileModel: (STAssetFileModel *) model;

@end
