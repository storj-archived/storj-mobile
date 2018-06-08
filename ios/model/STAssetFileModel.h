//
//  STAssetFileModel.h
//  StorjMobile
//
//  Created by Barterio on 6/7/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Photos/Photos.h>
#import "IConvertibleToJS.h"

@interface STAssetFileModel : NSObject

@property (nonatomic, strong) NSString *fileName;
@property (nonatomic, strong) NSDate *creationDate;
@property (nonatomic, strong) NSString *localIdentifier;
@property PHAssetMediaType mediaType;

-(instancetype) initWithFileName: (NSString *) fileName
                    creationDate: (NSDate *) creationDate
                 localIdentifier: (NSString *) localIdentifier
                       mediaType: (PHAssetMediaType) mediaType;

@end
