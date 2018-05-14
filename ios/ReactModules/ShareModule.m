//
//  ShareModule.m
//  StorjMobile
//
//  Created by Barterio on 5/10/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "ShareModule.h"

@implementation ShareModule

RCT_EXPORT_MODULE(ShareModuleIos);

RCT_REMAP_METHOD(shareFile,
                 shareFileWithUri: (NSString *) imageUri
                 resolver: (RCTPromiseResolveBlock) resolver
                 rejecter: (RCTPromiseRejectBlock) rejecter){
  NSLog(@"Share File: %@", imageUri);
  if([imageUri hasPrefix:@"file://"]) {
    imageUri = [imageUri stringByReplacingOccurrencesOfString:@"file://" withString:@""];
  }
  UIImage *image = [UIImage imageWithContentsOfFile:imageUri];
  if(!image){
    //handle error
    resolver([[Response errorResponseWithMessage:@"Unable"] toDictionary]);
  }
  UIActivityViewController *controller = [[UIActivityViewController alloc] initWithActivityItems:@[image]
                                                                           applicationActivities:nil];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *rootView = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [rootView presentViewController:controller
                           animated:YES
                         completion:^{
                           resolver([[SingleResponse successSingleResponseWithResult:nil] toDictionary]);
                         }];
  });
}

@end
