//
//  FileDbo.h
//  StorjMobile
//
//  Created by Barterio on 3/23/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "IConvertibleToJS.h"
@class FileModel;

@interface FileDbo : NSObject<IConvertibleToJS>

+(FileDbo *) fileDboFromFileModel: (FileModel *) model;

-(FileModel *) toModel;

-(NSString *) getId;

-(void) setProp: (NSString *) propName
     fromString: (NSString *) propValue;

-(void) setProp: (NSString *) propName
       fromBool: (BOOL) propValue;

-(void) setProp: (NSString *) propName
       fromLong: (long) propValue;

@end
