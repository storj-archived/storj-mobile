//
//  STFileUploadCallback.m
//  StorjMobile
//
//  Created by Bogdan Artemenko on 5/29/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STFileUploadCallback.h"

@import StorjIOS;

@implementation STFileUploadCallback

@synthesize _uploadErrorBlock, _uploadCompleteBlock, _uploadProgressBlock, _uploadStartBlock;

-(void) uploadProgressWithFileHandle: (long) fileHandle
                       uploadProgres: (double) uploadProgress
                         uploadBytes: (double) uploadedBytes
{
  if(_uploadProgressBlock)
  {
    _uploadProgressBlock(fileHandle, uploadProgress, uploadedBytes);
  }
}

-(void) uploadCompleteWithFileHandle: (long) fileHandle
                              fileId: (NSString *) fileId
{
  if(_uploadCompleteBlock)
  {
    _uploadCompleteBlock(fileHandle, fileId);
  }
}

-(void) errorWithFileHandle: (long) fileHandle
                  errorCode: (int) errorCode
               errorMessage: (NSString *) errorMessage
{
  if(_uploadErrorBlock)
  {
    _uploadErrorBlock(fileHandle, errorCode, errorMessage);
  }
}

-(void) uploadStartWithFileHandle:(long)fileHandle
{
  if(_uploadStartBlock)
  {
    _uploadStartBlock(fileHandle);
  }
}

@end
