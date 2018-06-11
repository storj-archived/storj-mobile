//
//  IConvertibleToJS.h
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

typedef NSDictionary * (^ConvertCallback)(NSObject *);

@protocol IConvertibleToJS <NSObject>

-(NSDictionary *) toDictionary;

@end
