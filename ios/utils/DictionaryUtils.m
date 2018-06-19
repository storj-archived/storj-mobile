//
//  DictionaryUtils.m
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "DictionaryUtils.h"

@implementation DictionaryUtils

+(NSString *) checkAndReturnNSString: (NSString *) checkedString {

  return checkedString == nil ? @"" : checkedString;
}

+(NSString *) convertToJsonWithDictionary: (NSDictionary *) dictionary {
  NSError * err;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject: dictionary options: 0 error: &err];

  if(!jsonData) {
    NSLog(@"Error while serialization");

    return @"";
  }

  NSString *resultString = [[NSString alloc] initWithData: jsonData encoding: NSUTF8StringEncoding];
  NSLog(@"result: %@", resultString);

  return resultString;
}

+(NSString *) convertToJsonWithArray: (NSArray<IConvertibleToJS> *) array{
  STConvertCallback callback = ^(NSObject<IConvertibleToJS> *object)
  {
    NSDictionary *dict = nil;
    dict = [object toDictionary];
    return dict;
  };

  return [self convertToJsonWithArray: array andConvertCallback: callback];
}

+(NSString *) convertToJsonWithArray:(NSArray *) array andConvertCallback: (STConvertCallback) callback
{
  NSError * err;
  NSMutableArray *marray = [NSMutableArray arrayWithCapacity: [array count]];
  for (int i = 0; i < [array count]; i++) {
    [marray insertObject: callback(array[i]) atIndex:i];
  }
  NSData * jsonData = [NSJSONSerialization dataWithJSONObject: marray
                                                      options:0
                                                        error:&err];
  if(!jsonData) {
    NSLog(@"Error while serialization");
    
    return @"";
  }
  NSString *resultString = [[NSString alloc] initWithData: jsonData
                                                 encoding: NSUTF8StringEncoding];
  //  NSLog(@"result: %@", resultString);
  
  return resultString;
}

+(BOOL) isNSStringValid: (NSString *) stringToCheck {

  return stringToCheck && stringToCheck.length > 0;
}


@end
