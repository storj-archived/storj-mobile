//
//  STFileDownloadCallback.m
//  StorjMobile
//
//  Created by Barterio on 5/30/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STFileDownloadCallback.h"

@implementation STFileDownloadCallback

@synthesize _downloadErrorBlock, _downloadStartBlock, _downloadCompleteBlock, _downloadProgressBlock;

-(void) downloadProgressWithFileId: (NSString *) fileId
                        fileHandle: (long) fileHandle
                  downloadProgress: (double) downloadProgress;
{
  if(_downloadProgressBlock)
  {
    _downloadProgressBlock(fileId, fileHandle, downloadProgress);
  }
}

-(void) downloadCompleteWithFileId: (NSString *) fileId
                          filePath: (NSString *) filePath
                         thumbnail: (NSString * _Nullable) thumbnail
{
  if(_downloadCompleteBlock)
  {
    _downloadCompleteBlock(fileId, filePath, thumbnail);
  }
}

-(void) errorWithFileId: (NSString *) fileId
              errorCode: (int) errorCode
           errorMessage: (NSString *) errorMessage
{
  if(_downloadErrorBlock)
  {
    _downloadErrorBlock(fileId, errorCode, errorMessage);
  }
}

-(void) downloadStartWithFileId: (NSString *) fileId
                     fileHandle: (long) fileHandle;
{
  if(_downloadStartBlock)
  {
    _downloadStartBlock(fileId, fileHandle);
  }
}

@end
