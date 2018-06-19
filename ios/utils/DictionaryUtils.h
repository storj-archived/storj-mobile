//
//  DictionaryUtils.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//
#import "IConvertibleToJS.h"
@import Foundation;

@interface DictionaryUtils : NSObject

+(NSString *) checkAndReturnNSString: (NSString *) checkedString;

+(NSString *) convertToJsonWithDictionary: (NSDictionary *) dictionary;

+(NSString *) convertToJsonWithArray: (NSArray *) array;

+(NSString *) convertToJsonWithArray:(NSArray *) array andConvertCallback: (STConvertCallback) callback;

+(BOOL) isNSStringValid: (NSString *) stringToCheck;

@end
