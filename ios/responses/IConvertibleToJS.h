//
//  IConvertibleToJS.h
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol IConvertibleToJS <NSObject>

-(NSDictionary *) toDictionary;

@end
