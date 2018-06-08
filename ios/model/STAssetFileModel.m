//
//  STAssetFileModel.m
//  StorjMobile
//
//  Created by Barterio on 6/7/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STAssetFileModel.h"
#import "DictionaryUtils.h"

@implementation STAssetFileModel

-(instancetype) initWithFileName: (NSString *) fileName
                    creationDate: (NSDate *) creationDate
                 localIdentifier: (NSString *) localIdentifier
                       mediaType: (PHAssetMediaType) mediaType
{
  if(self = [super init])
  {
    _fileName = fileName;
    _creationDate = creationDate;
    _localIdentifier = localIdentifier;
    _mediaType = mediaType;
  }
  return self;
}

-(NSDictionary *) toDictionary
{
  return @{
           @"fileName" : [DictionaryUtils checkAndReturnNSString:_fileName],
           @"creationDate" : _creationDate,
           @"localIdentifier" : [DictionaryUtils checkAndReturnNSString:_localIdentifier],
           @"mediaType" : @((long)_mediaType)
           };
}

@end
