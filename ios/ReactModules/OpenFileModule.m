//
//  OpenFileModule.m
//  StorjMobile
//
//  Created by Barterio on 5/16/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "OpenFileModule.h"

@implementation OpenFileModule

RCT_EXPORT_MODULE(OpenFileModule)

RCT_REMAP_METHOD(checkFile,
                 checkFileWithFileName: (NSString *) fileName
                 resolver: (RCTPromiseResolveBlock) resolver
                 rejecter: (RCTPromiseRejectBlock) rejecter) {
  if(!fileName || fileName.length == 0) {
    resolver([Response errorResponseWithMessage:@"Illegal file name"]);
    
    return;
  }
  
  NSString *fileExtension = [fileName pathExtension];
  if(!fileExtension || fileExtension.length == 0) {
    resolver([Response errorResponseWithMessage:@"Cannot retreive file extension"]);
    
    return;
  }
  
  BOOL contains = [@[@"doc", @"pdf",  @"ppt", @"pptx", @"rtf", @"wav", @"mp3", @"txt", @"3gp",
                     @"mpg", @"mpeg", @"mpe", @"mp4", @"avi"] containsObject:fileExtension];
  
  resolver([[[Response alloc] initWithSuccess:contains andWithError:nil] toDictionary]);
}

RCT_REMAP_METHOD(openFile,
                 openFileWithFileUri: (NSString *) fileUri
                 resolver: (RCTPromiseResolveBlock) resolver
                 rejecter: (RCTPromiseRejectBlock) rejecter) {
  NSLog(@"Open file: %@", fileUri);
  if(!fileUri || fileUri.length == 0) {
    resolver([[Response errorResponseWithMessage:@"URI is corrupted."] toDictionary]);
    return;
  }
 
  NSURL *fileUrl = [NSURL fileURLWithPath:fileUri];
  if(!fileUrl) {
    resolver([[Response errorResponseWithMessage:@"Cannot share file(URL corrupted)."] toDictionary]);
    return;
  }
  UIDocumentInteractionController *openFileController = [UIDocumentInteractionController interactionControllerWithURL:fileUrl];
  
  openFileController.delegate = self;
  [openFileController presentPreviewAnimated:YES];
  resolver([[Response successResponse] toDictionary]);
}

RCT_REMAP_METHOD(shareFile,
                 shareFileWithUri: (NSString *) fileUri
                 resolver: (RCTPromiseResolveBlock) resolver
                 rejecter: (RCTPromiseRejectBlock) rejecter){
  
  if(!fileUri || fileUri.length == 0) {
    resolver([[Response errorResponseWithMessage:@"File URI is corrupted."] toDictionary]);
    return;
  }
  
  NSURL *url = [NSURL fileURLWithPath:fileUri];
  UIActivityViewController *controller = [[UIActivityViewController alloc] initWithActivityItems:@[url]
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


-(UIViewController *) documentInteractionControllerViewControllerForPreview:(UIDocumentInteractionController *)controller {
  
  return [[[[UIApplication sharedApplication] delegate] window] rootViewController];
}

@end
