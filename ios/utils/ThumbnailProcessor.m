//
//  ThumbnailProcessor.m
//  StorjMobile
//
//  Created by Barterio on 4/25/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "ThumbnailProcessor.h"
#import "SingleResponse.h"
#import "FileRepository.h"

@import Foundation;

@implementation ThumbnailProcessor
@synthesize _fileRepository;

-(ThumbnailProcessor *) initWithFileRepository: (FileRepository *) fileRepository {
  if(self = [super init]) {
    _fileRepository = fileRepository;
  }

  return self;
}

-(SingleResponse *) getThumbnailWithFileId: (NSString *) fileID
                                  filePath: (NSString *) filePath {
  if(!fileID || fileID.length == 0) {

    return [SingleResponse errorResponseWithMessage: @"Illegal file ID"];
  }

  if(!filePath || filePath.length == 0) {

    return [SingleResponse errorResponseWithMessage: @"Illegal file path"];
  }
  
  NSString * base64Image = [self getThumbnailWithImagePath: filePath];
  
  if(!base64Image || base64Image.length == 0) {

    return [SingleResponse errorResponseWithMessage: @"Error while converting"];
  }
  
  Response * updateResult = [[self _fileRepository] updateThumbnailWithFileId: fileID
                                                              thumbnailBase64: base64Image];
  if([updateResult isSuccess]) {
    
    return [SingleResponse successSingleResponseWithResult: base64Image];
  }
  
  return [SingleResponse errorResponseWithMessage: @"Unknown error"];
}

-(SingleResponse *) getThumbnailWithFilePath: (NSString *) filePath {
  if(!filePath || filePath.length == 0) {
    
    return [SingleResponse errorResponseWithMessage: @"Illegal file path"];
  }
  NSString * base64Image = [self getThumbnailWithImagePath: filePath];
  
  if(!base64Image || base64Image.length == 0) {
    
    return [SingleResponse errorResponseWithMessage: @"Error while converting"];
  }
  
  return [SingleResponse successSingleResponseWithResult: base64Image];
}

-(NSString *) getThumbnailWithImagePath: (NSString *) imagePath {
  if([imagePath hasPrefix: @"file://"]) {
    imagePath = [imagePath stringByReplacingOccurrencesOfString: @"file://" withString: @""];
  }
  UIImage *image = [UIImage imageWithContentsOfFile: imagePath];
  NSData *imageData = UIImagePNGRepresentation(image);
  CGImageSourceRef src = CGImageSourceCreateWithData((__bridge CFDataRef)imageData, NULL);
  CFDictionaryRef options = (__bridge CFDictionaryRef) @{
                                                         (id) kCGImageSourceCreateThumbnailWithTransform : @YES,
                                                         (id) kCGImageSourceCreateThumbnailFromImageAlways : @YES,
                                                         (id) kCGImageSourceThumbnailMaxPixelSize : @(THUMBNAIL_SIZE)};
  
  CGImageRef scaledImageRef = CGImageSourceCreateThumbnailAtIndex(src, 0, options);
  UIImage *scaled = [UIImage imageWithCGImage: scaledImageRef];
  CGImageRelease(scaledImageRef);
  
  NSData *imageScaledData = UIImagePNGRepresentation(scaled);
  
  return [imageScaledData base64EncodedStringWithOptions: NSDataBase64Encoding64CharacterLineLength];
}

@end
