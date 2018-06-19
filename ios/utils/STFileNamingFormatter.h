//
//  STFileNamingFormatter.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 6/4/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
@class STAssetFileModel;

@interface STFileNamingFormatter : NSObject

+(NSString *) fileNameWithSTAssetFileModel: (STAssetFileModel *) model;

@end
