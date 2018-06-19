//
//  STCameraModule.m
//  StorjMobile
//  Created by Bogdan Artemenko on 5/10/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STUploadService.h"
#import "STCameraModule.h"
#import "STStorjBackgroundServices.h"

@implementation STCameraModule
@synthesize _bucketId;

RCT_EXPORT_MODULE(CameraModuleIos);

RCT_REMAP_METHOD(openCamera,
                 openCameraWithBucketId:(NSString *) bucketId
                 resolver: (RCTPromiseResolveBlock) resolve
                 andRejecter: (RCTPromiseRejectBlock) reject) {
  _bucketId = bucketId;
  UIImagePickerController *imagePickerController = [[UIImagePickerController alloc] init];
  imagePickerController.delegate = self;
  imagePickerController.allowsEditing = YES;
  imagePickerController.sourceType = UIImagePickerControllerSourceTypeCamera;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *rootView = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [rootView presentViewController: imagePickerController
                           animated: YES
                         completion: NULL];
  });
}

-(void) imagePickerController:(UIImagePickerController *)picker
didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info {
//  NSURL *imageURL = [info valueForKey: UIImagePickerControllerReferenceURL];
//  NSString *mediaType = [info objectForKey: UIImagePickerControllerMediaType];
  
  NSString *tempFileName = [[NSUUID UUID] UUIDString];
  NSString *fileName = [tempFileName stringByAppendingString: @".png"];
  NSString *path = [[NSTemporaryDirectory()stringByStandardizingPath] stringByAppendingPathComponent: fileName];
  UIImage *image =[info objectForKey: UIImagePickerControllerOriginalImage];
  NSData *data = UIImageJPEGRepresentation(image, 1);
  [data writeToFile: path atomically: YES];
  NSString *filePath = [[NSURL fileURLWithPath: path] absoluteString];
  [picker dismissViewControllerAnimated:YES completion:NULL];
  if(filePath) {
    [[STUploadService sharedInstance] uploadFileWithBucketId: _bucketId
                                                  fileName: fileName
                                                 localPath: filePath];
  }
}

-(void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
  [picker dismissViewControllerAnimated:YES completion:NULL];
}

@end
