//
//  DictionaryUtils.m
//  StorjMobile
//
//  Created by Barterio on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "DictionaryUtils.h"

@implementation DictionaryUtils

+(NSString *) checkAndReturnNSString:(NSString *)checkedString{
  return checkedString == nil? @"" : checkedString;
}


+(NSString *) convertToJsonWithDictionary:(NSDictionary *)dictionary{
  NSError * err;
  NSData * jsonData = [NSJSONSerialization dataWithJSONObject:dictionary options:0 error:&err];
  if(!jsonData){
    NSLog(@"Error while serialization");
    return @"";
  }
  NSString *resultString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  NSLog(@"result: %@", resultString);
  return resultString;
}

+(NSString *) convertToJsonWithArray:(NSArray *)array{
  NSError * err;
  NSData * jsonData = [NSJSONSerialization dataWithJSONObject:array options:0 error:&err];
  if(!jsonData){
    NSLog(@"Error while serialization");
    return @"";
  }
  NSString *resultString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  NSLog(@"result: %@", resultString);
  return resultString;
}


@end
