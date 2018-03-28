//
//  FileUtils.m
//  StorjMobile
//
//  Created by Barterio on 3/28/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "FileUtils.h"

@implementation FileUtils

+(NSNumber *) getFileSizeWithPath: (NSString *)filePath{
  return [NSNumber numberWithUnsignedLongLong:[[[NSFileManager defaultManager]
                                                attributesOfItemAtPath:filePath error:nil]
                                               fileSize]];
}

+(NSString *) getFileNameWithPath: (NSString *)filePath{
  return [[filePath lastPathComponent] stringByDeletingPathExtension];
}

@end
