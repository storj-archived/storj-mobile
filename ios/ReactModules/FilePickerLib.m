//
//  FilePickerLib.m
//  StorjMobile
//
//  Created by Barterio on 2/27/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "FilePickerLib.h"
#import <AssetsLibrary/AssetsLibrary.h>
@import MobileCoreServices;
#import "SingleResponse.h"
#import <Photos/Photos.h>

#define KEY_PATH "path"
#define KEY_ERROR_MESSAGE "errorMessage"
#define KEY_SUCCESS "isSuccess"
#define KEY_RESULT "result"
#define KEY_NAME "name"

#define OPTIONS_KEY_MIME_TYPE "mimeType"
#define OPTIONS_KEY_FILE_PICKER_TITLE "pickerTitle"

@interface FilePickerLib()

@property (nonatomic, strong) UIImagePickerController *picker;
@property (nonatomic, strong) NSDictionary *defaultOptions;
@property (nonatomic, strong) NSMutableDictionary *options;
@property (nonatomic, strong) RCTPromiseRejectBlock reject;
@property (nonatomic, strong) RCTPromiseResolveBlock resolve;

@end

@implementation FilePickerLib

RCT_EXPORT_MODULE(FilePickerIos);

-(instancetype) init {
  if(self = [super init]) {
    self.defaultOptions = @{
                            @OPTIONS_KEY_FILE_PICKER_TITLE : @"Select",
                            @OPTIONS_KEY_MIME_TYPE : @"*/*"
                          };
  }
  
  return self;
}


RCT_REMAP_METHOD(show,
                 showWithOptions:(NSDictionary *) options
                 resolver: (RCTPromiseResolveBlock) resolve
                 rejector: (RCTPromiseRejectBlock) reject) {
  
  self.resolve = resolve;
  self.reject = reject;
  
  self.options =  [NSMutableDictionary dictionaryWithDictionary: self.defaultOptions];
  for (NSString *key in options.keyEnumerator) {
    [self.options setValue: options[key] forKey: key];
  }
  
  self.picker = [[UIImagePickerController alloc] init];
  self.picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
  self.picker.mediaTypes = @[(NSString *)kUTTypeImage, (NSString *)kUTTypeMovie];
  self.picker.videoQuality = UIImagePickerControllerQualityTypeHigh;
  self.picker.modalPresentationStyle = UIModalPresentationCurrentContext;
  self.picker.delegate = self;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    while (root.presentedViewController != nil) {
      root = root.presentedViewController;
    }
    [root presentViewController: self.picker
                       animated: YES
                     completion: nil];
  });
}

- (void)imagePickerControllerDidCancel: (UIImagePickerController *) picker {
  dispatch_async(dispatch_get_main_queue(), ^{
    [picker dismissViewControllerAnimated: YES
                               completion: nil];
  });
  self.resolve(@{@KEY_SUCCESS: @(NO),
                  @KEY_RESULT: @[@{@KEY_PATH: @"",
                                   @KEY_ERROR_MESSAGE: @""
                                   }
                                ],
                  @KEY_ERROR_MESSAGE: @"Canceled by user"
                  });
}
  
  - (void)imagePickerController: (UIImagePickerController *)picker didFinishPickingMediaWithInfo: (NSDictionary *)info
  {
    dispatch_async(dispatch_get_main_queue(), ^{
      [picker dismissViewControllerAnimated: YES completion: nil];
    });
    
    NSString *mediaType = [info objectForKey: UIImagePickerControllerMediaType];
    if([mediaType isEqualToString: (NSString *) kUTTypeImage]){
      [self processRetrievedImage: info];
      return;
    }
    if([mediaType isEqualToString: (NSString *) kUTTypeMovie]){
      [self processRetrievedVideo: info];
      return;
    }
  }

-(void)processRetrievedImage: (NSDictionary *) info {
  
  NSURL *imageURL = [info valueForKey: UIImagePickerControllerReferenceURL];
  PHAsset *asset = [[PHAsset fetchAssetsWithALAssetURLs:@[imageURL] options:nil] firstObject];

  NSString *fileName = [asset valueForKey:@"filename"];
  NSLog(@"PHAsset local ident: %@", fileName);
  
  NSString *path = [[NSTemporaryDirectory()stringByStandardizingPath] stringByAppendingPathComponent: fileName];
  UIImage *image =[info objectForKey: UIImagePickerControllerOriginalImage];
  
  // GIFs break when resized, so we handle them differently
  if ([[imageURL absoluteString] containsString: @"ext=GIF"]) {
    ALAssetsLibrary* assetsLibrary = [[ALAssetsLibrary alloc] init];
    [assetsLibrary assetForURL: imageURL resultBlock: ^(ALAsset *asset) {
      ALAssetRepresentation *rep = [asset defaultRepresentation];
      
      Byte *buffer = (Byte*)malloc(rep.size);
      NSUInteger buffered = [rep getBytes: buffer fromOffset: 0.0 length: rep.size error: nil];
      NSData *data = [NSData dataWithBytesNoCopy: buffer length: buffered freeWhenDone: YES];
      [data writeToFile: path atomically: YES];
      
      NSString *fileURL = [[NSURL fileURLWithPath: path] absoluteString];
      if(fileURL){
        self.resolve(@{@KEY_SUCCESS: @(YES),
                        @KEY_RESULT: @[@{@KEY_PATH: fileURL,
                                         @KEY_ERROR_MESSAGE: @""
                                         }
                                      ],
                        @KEY_ERROR_MESSAGE: @""
                        });
      } else {
        self.resolve(@{@KEY_SUCCESS: @(NO),
                        @KEY_RESULT: @[@{@KEY_PATH: @"",
                                         @KEY_ERROR_MESSAGE: @""
                                         }
                                      ],
                        @KEY_ERROR_MESSAGE: @"Error with getting full path"
                        });
      }
    } failureBlock: ^(NSError *error) {
      self.resolve(@{@KEY_SUCCESS: @(YES),
                      @KEY_RESULT: @[@{@KEY_PATH: @"",
                                       @KEY_ERROR_MESSAGE: @""
                                       }
                                    ],
                      @KEY_ERROR_MESSAGE: [error localizedDescription]
                      });
    }];
    return;
  }
  
  image = [self fixOrientation: image];  // Rotate the image for upload to web
  NSData *data = UIImageJPEGRepresentation(image, 1);
  [data writeToFile: path atomically: YES];
  NSString *filePath = [[NSURL fileURLWithPath: path] absoluteString];
  if(filePath){
    self.resolve(@{@KEY_SUCCESS: @(YES),
                    @KEY_RESULT: @[@{@KEY_PATH: filePath,
                                     @KEY_ERROR_MESSAGE: @""
                                     }
                                  ],
                    @KEY_ERROR_MESSAGE: @""
                    });
    return;
  } else {
    self.resolve(@{@KEY_SUCCESS: @(NO),
                    @KEY_RESULT: @[@{@KEY_PATH: @"",
                                     @KEY_ERROR_MESSAGE: @""
                                     }
                                  ],
                    @KEY_ERROR_MESSAGE: @"Error with getting full path"
                    });
    return;
  }
}

-(void) processRetrievedVideo: (NSDictionary *)info{
  NSURL *videoURL = info[UIImagePickerControllerMediaURL];
  NSLog(@"VideoURL: lastPath: %@", [videoURL lastPathComponent]);
  NSString *fileName;
  if (@available(iOS 11.0, *)) {
    PHAsset *asset = [info objectForKey:UIImagePickerControllerPHAsset];
    
    NSDate *creationDate = [asset valueForKey:@"creationDate"];
    //  [creationDate ]
    if(creationDate)
    {
      NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
      dateFormatter.locale = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
      dateFormatter.dateFormat = @"yyy-MM-d_HH-mm-ss";
      NSString *formattedDate = [dateFormatter stringFromDate:creationDate];
      if(formattedDate)
      {
        NSString *extension = [[asset valueForKey:@"filename"] pathExtension];
        fileName = [NSString stringWithFormat:@"Video_%@.%@", formattedDate, extension];
      }
    } else {
      fileName = [asset valueForKey:@"filename"];
    }
  } else {
    fileName = [videoURL lastPathComponent];
  }
 
  
  NSString *path = [[NSTemporaryDirectory()stringByStandardizingPath] stringByAppendingPathComponent: fileName];
  NSURL *videoDestinationURL = [NSURL fileURLWithPath: path];
  
  NSFileManager *fileManager = [NSFileManager defaultManager];
  if ([fileName isEqualToString: @"capturedvideo.MOV"]) {
    if ([fileManager fileExistsAtPath: videoDestinationURL.path]) {
      [fileManager removeItemAtURL: videoDestinationURL error: nil];
    }
  }
  NSError *error = nil;
  if([fileManager fileExistsAtPath:videoDestinationURL.path] || [videoURL.path isEqualToString:videoDestinationURL.path]) {
    NSDictionary *response = @{@KEY_SUCCESS: @(YES),
                                @KEY_RESULT: @[@{@KEY_PATH: [videoDestinationURL absoluteString],
                                                  @KEY_ERROR_MESSAGE: @"",
                                                  @KEY_NAME: @""
                                                  }
                                               ],
                                @KEY_ERROR_MESSAGE: @""
                                };
    NSLog(@"Video picker response: %@", response);
    self.resolve(response);
    return;
  }
  [fileManager moveItemAtURL: videoURL toURL: videoDestinationURL error: &error];

  if (error) {
    self.resolve(@{@KEY_SUCCESS: @(NO),
                    @KEY_RESULT: @[@{@KEY_PATH: @"",
                                     @KEY_ERROR_MESSAGE: [error localizedDescription]
                                     }
                                  ],
                    @KEY_ERROR_MESSAGE: [error localizedDescription]
                    });
    return;
  }
  if(videoDestinationURL){
    self.resolve(@{@KEY_SUCCESS: @(YES),
                    @KEY_RESULT: @[@{@KEY_PATH: [videoDestinationURL absoluteString],
                                     @KEY_ERROR_MESSAGE: @""
                                     }
                                  ],
                    @KEY_ERROR_MESSAGE: @""
                    });
    return;
  } else{
    self.resolve(@{@KEY_SUCCESS: @(NO),
                    @KEY_RESULT: @[@{@KEY_PATH: @"",
                                     @KEY_ERROR_MESSAGE: @""
                                     }
                                  ],
                    @KEY_ERROR_MESSAGE: @"Error while retrieving Video URL"
                    });
    return;
  }
}

+(NSString *) convertToJsonWithArray: (NSArray *)array{
  NSError * err;
  NSData * jsonData = [NSJSONSerialization dataWithJSONObject: array options: 0 error: &err];
  if(!jsonData){
    NSLog(@"Error while serialization");
    return @"";
  }
  NSString *resultString = [[NSString alloc] initWithData: jsonData encoding: NSUTF8StringEncoding];
  //  NSLog(@"result:  %@", resultString);
  return resultString;
}

- (UIImage *)fixOrientation: (UIImage *)srcImg {
  if (srcImg.imageOrientation == UIImageOrientationUp) {
    return srcImg;
  }
  
  CGAffineTransform transform = CGAffineTransformIdentity;
  switch (srcImg.imageOrientation) {
    case UIImageOrientationDown:
    case UIImageOrientationDownMirrored:
      transform = CGAffineTransformTranslate(transform, srcImg.size.width, srcImg.size.height);
      transform = CGAffineTransformRotate(transform, M_PI);
      break;
      
    case UIImageOrientationLeft:
    case UIImageOrientationLeftMirrored:
      transform = CGAffineTransformTranslate(transform, srcImg.size.width, 0);
      transform = CGAffineTransformRotate(transform, M_PI_2);
      break;
      
    case UIImageOrientationRight:
    case UIImageOrientationRightMirrored:
      transform = CGAffineTransformTranslate(transform, 0, srcImg.size.height);
      transform = CGAffineTransformRotate(transform, -M_PI_2);
      break;
    case UIImageOrientationUp:
    case UIImageOrientationUpMirrored:
      break;
  }
  
  switch (srcImg.imageOrientation) {
    case UIImageOrientationUpMirrored:
    case UIImageOrientationDownMirrored:
      transform = CGAffineTransformTranslate(transform, srcImg.size.width, 0);
      transform = CGAffineTransformScale(transform, -1, 1);
      break;
      
    case UIImageOrientationLeftMirrored:
    case UIImageOrientationRightMirrored:
      transform = CGAffineTransformTranslate(transform, srcImg.size.height, 0);
      transform = CGAffineTransformScale(transform, -1, 1);
      break;
    case UIImageOrientationUp:
    case UIImageOrientationDown:
    case UIImageOrientationLeft:
    case UIImageOrientationRight:
      break;
  }
  
  CGContextRef ctx = CGBitmapContextCreate(NULL, srcImg.size.width, srcImg.size.height, CGImageGetBitsPerComponent(srcImg.CGImage), 0, CGImageGetColorSpace(srcImg.CGImage), CGImageGetBitmapInfo(srcImg.CGImage));
  CGContextConcatCTM(ctx, transform);
  switch (srcImg.imageOrientation) {
    case UIImageOrientationLeft:
    case UIImageOrientationLeftMirrored:
    case UIImageOrientationRight:
    case UIImageOrientationRightMirrored:
      CGContextDrawImage(ctx, CGRectMake(0,0,srcImg.size.height,srcImg.size.width), srcImg.CGImage);
      break;
      
    default:
      CGContextDrawImage(ctx, CGRectMake(0,0,srcImg.size.width,srcImg.size.height), srcImg.CGImage);
      break;
  }
  
  CGImageRef cgimg = CGBitmapContextCreateImage(ctx);
  UIImage *img = [UIImage imageWithCGImage: cgimg];
  CGContextRelease(ctx);
  CGImageRelease(cgimg);
  return img;
}


@end
