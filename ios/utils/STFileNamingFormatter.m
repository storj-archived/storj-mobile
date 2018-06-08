//
//  STFileNamingFormatter.m
//  StorjMobile
//
//  Created by Barterio on 6/4/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STFileNamingFormatter.h"
#import "STAssetFileModel.h"

@implementation STFileNamingFormatter

+(NSString *) fileNameWithSTAssetFileModel: (STAssetFileModel *) model
{
  if(!model)
  {
    return nil;
  }
  switch ([model mediaType]) {
    case PHAssetMediaTypeImage:
      return [STFileNamingFormatter photoNameWithAssetModel:model];
      
    case PHAssetMediaTypeVideo:
      return [STFileNamingFormatter videoNameWithAssetModel:model];
      
    default:
      return nil;
  }
}

+(NSString *) photoNameWithAssetModel: (STAssetFileModel *) model
{
  return [model fileName];
}

+(NSString *) videoNameWithAssetModel: (STAssetFileModel *) model
{
  if(![model creationDate])
  {
    return [[model localIdentifier] stringByAppendingPathExtension:@"mov"];
  }
  
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  dateFormatter.locale = [NSLocale localeWithLocaleIdentifier: @"en_US_POSIX"];
  dateFormatter.dateFormat = @"yyy-MM-d_HH-mm-ss";
  NSString *formattedDate = [dateFormatter stringFromDate: [model creationDate]];
  if(formattedDate)
  {
    NSString *extension = [[[model fileName] pathExtension] lowercaseString];
    
    return [NSString stringWithFormat:@"Video_%@.%@", formattedDate, extension];
  }
  
  return [[model localIdentifier] stringByAppendingPathExtension:@"mov"];
}

@end
