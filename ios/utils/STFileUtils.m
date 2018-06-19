//
//  STFileUtils.m
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/28/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STFileUtils.h"

@implementation STFileUtils

+(NSNumber *) getFileSizeWithPath: (NSString *)filePath
{
  return [NSNumber numberWithUnsignedLongLong:[[[NSFileManager defaultManager]
                                                attributesOfItemAtPath:filePath error:nil]
                                               fileSize]];
}

+(NSString *) getFileNameWithPath: (NSString *)filePath
{
  return [filePath lastPathComponent];
}

+(NSString *) getFileNameWithoutExtensionWithPath: (NSString *)filePath
{
  return [[filePath lastPathComponent] stringByDeletingPathExtension];
}



@end
