//
//  Logger.m
//  StorjMobile
//
//  Created by Barterio on 5/29/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "Logger.h"

#define DEBUG 1

@implementation Logger

+(void) log: (NSString *) message
  {
    NSArray *dirPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *docsDir = dirPaths[0];
    NSString *filePath = [[NSString alloc] initWithString:[docsDir stringByAppendingPathComponent: @"storjAppLog.txt"]];
    
    FILE *fp;
    fp = fopen([filePath cStringUsingEncoding:NSUTF8StringEncoding], "a+");
    if(!fp){
      return;
    }
    if(DEBUG)
    {
      NSLog(@"message: %@", message);
    }
    fprintf(fp, "\nmessage: '%s'", [message cStringUsingEncoding:NSUTF8StringEncoding]);
    fclose(fp);
  }
  
@end
