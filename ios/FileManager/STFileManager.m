//
//  STFileManager.m
//  StorjMobile
//
//  Created by Developer Mac on 30.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//
#import "STFileManager.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <Photos/Photos.h>
#import "Logger.h"

@implementation STFileManager
{
  @private
  PHPhotoLibrary *_photoLibrary;
}

- (instancetype)init
{
  if (self = [super init])
  {
    _photoLibrary = [PHPhotoLibrary sharedPhotoLibrary];
  }
  
  return self;
}

-(NSMutableArray *) getAssetsFromGallery
{
  PHFetchResult *imageResults = [PHAsset fetchAssetsWithMediaType:PHAssetMediaTypeImage options:nil];
  PHFetchResult *videoResults = [PHAsset fetchAssetsWithMediaType:PHAssetMediaTypeVideo options:nil];
  
  NSMutableArray *temp = [NSMutableArray arrayWithCapacity:(imageResults.count + videoResults.count)];
  NSMutableArray *temp1 = [NSMutableArray arrayWithCapacity:(imageResults.count + videoResults.count)];
  
  [imageResults enumerateObjectsUsingBlock:^(PHAsset *obj, NSUInteger idx, BOOL * _Nonnull stop) {
    [temp addObject:obj];
    [temp1 addObject:@{@"fname" : [obj valueForKey:@"filename"]}];
  }];
  
  [videoResults enumerateObjectsUsingBlock:^(PHAsset *obj, NSUInteger idx, BOOL * _Nonnull stop) {
    [temp addObject:obj];
    [temp1 addObject:@{@"fname" : [obj valueForKey:@"filename"]}];
  }];
  
//  [Logger log:[NSString stringWithFormat:@"GetAssetFromGallery: count: %d array: %@",[temp count], temp]];ß
  return temp;
}

@end
