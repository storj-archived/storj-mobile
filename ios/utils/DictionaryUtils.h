//
//  DictionaryUtils.h
//  StorjMobile
//
//  Created by Barterio on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

@interface DictionaryUtils : NSObject

+(NSString *) checkAndReturnNSString: (NSString *) checkedString;

+(NSString *) convertToJsonWithDictionary: (NSDictionary *) dictionary;

+(NSString *) convertToJsonWithArray: (NSArray *) array;

+(BOOL) isNSStringValid: (NSString *) stringToCheck;

@end
