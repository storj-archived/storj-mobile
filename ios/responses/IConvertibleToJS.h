//
//  IConvertibleToJS.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

typedef NSDictionary * (^STConvertCallback)(NSObject *);

@protocol IConvertibleToJS <NSObject>

-(NSDictionary *) toDictionary;

@end
