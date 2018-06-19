//
//  STFileUtils.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/28/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

@interface STFileUtils : NSObject

+(NSNumber *) getFileSizeWithPath: (NSString *)filePath;

+(NSString *) getFileNameWithPath: (NSString *)filePath;

+(NSString *) getFileNameWithoutExtensionWithPath: (NSString *)filePath;

@end
