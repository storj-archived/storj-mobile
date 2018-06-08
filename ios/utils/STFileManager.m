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
#import "STAssetFileModel.h"
#import "STFileNamingFormatter.h"

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

-(NSMutableArray <STAssetFileModel *> *) getAssetsFromGallery
{
  PHFetchResult *imageResults = [PHAsset
                                 fetchAssetsWithMediaType: PHAssetMediaTypeImage options:nil];
  PHFetchResult *videoResults = [PHAsset
                                 fetchAssetsWithMediaType: PHAssetMediaTypeVideo options:nil];
  
  NSMutableArray <STAssetFileModel *> *assetsArray = [NSMutableArray
                           arrayWithCapacity: (imageResults.count + videoResults.count)];
  
  void(^dataRetriever)(PHAsset *obj) = ^(PHAsset *obj)
  {
    STAssetFileModel * asset = [[STAssetFileModel alloc] initWithFileName:[obj valueForKey:@"filename"]
                                                             creationDate:[obj valueForKey:@"creationDate"]
                                                          localIdentifier:[obj localIdentifier]
                                                                mediaType:[obj mediaType]];
    asset.fileName = [STFileNamingFormatter fileNameWithSTAssetFileModel: asset];
    
    [assetsArray addObject: asset];
  };
  
  [imageResults enumerateObjectsUsingBlock: ^(PHAsset *obj, NSUInteger idx, BOOL * _Nonnull stop)
  {
    dataRetriever(obj);
  }];
  
  [videoResults enumerateObjectsUsingBlock: ^(PHAsset *obj, NSUInteger idx, BOOL * _Nonnull stop)
  {
    dataRetriever(obj);
  }];

  [Logger log: [NSString stringWithFormat: @"PHAssets count: %lu array: %@",
                 (unsigned long)[assetsArray count], assetsArray]];
  
  return assetsArray;
}

-(NSString *) getUploadFolder
{
  NSString * uploadDir = [NSSearchPathForDirectoriesInDomains(/*NSDocumentDirectory*/NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
  uploadDir = [uploadDir stringByAppendingString:@"/Uploads"];
  NSLog(@"UploadsDir: %@", uploadDir);
  if(![[NSFileManager defaultManager]fileExistsAtPath:uploadDir isDirectory:NULL]){
    NSError *error = nil;
    if (![[NSFileManager defaultManager] createDirectoryAtPath:uploadDir withIntermediateDirectories:YES attributes:nil error:&error]) {
      NSLog(@"%@", error.localizedDescription);
    }
  }
  return uploadDir;
}

-(NSString *) getDownloadFolder
{
  NSString * downloadsDir = [NSSearchPathForDirectoriesInDomains(/*NSDocumentDirectory*/NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
  downloadsDir = [downloadsDir stringByAppendingString:@"/Downloads"];
  NSLog(@"DonwloadsDir: %@", downloadsDir);
  if(![[NSFileManager defaultManager]fileExistsAtPath:downloadsDir isDirectory:NULL]){
    NSError *error = nil;
    if (![[NSFileManager defaultManager] createDirectoryAtPath:downloadsDir withIntermediateDirectories:YES attributes:nil error:&error]) {
      NSLog(@"%@", error.localizedDescription);
    }
  }
  return downloadsDir;
}

@end
