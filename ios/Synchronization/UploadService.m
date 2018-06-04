//
//  UploadService.m
//  StorjMobile
//
//  Created by Developer Mac on 01.06.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "UploadService.h"
#import "STUploader.h"
#import "STFileUploadCallback.h"
#import "UploadFileContract.h"
#import "StorjBackgroundServices.h"
#import "EventNames.h"
#import "FileContract.h"
#import "Logger.h"
#import "DictionaryUtils.h"

typedef void (^UploadTask)(void);

static UploadService *instance = nil;
static dispatch_once_t onceToken;

@implementation UploadService
{
  @private
  dispatch_queue_t workerQueue;
  dispatch_queue_t syncQueue;
}

-(instancetype) init
{
  if(self = [super init])
  {
    workerQueue = dispatch_queue_create("io.storj.mobile.workerUpload.queue", DISPATCH_QUEUE_SERIAL);
    syncQueue = dispatch_queue_create("io.storj.mobile.syncUpload.queue", DISPATCH_QUEUE_SERIAL);
  }
  
  return self;
}

+(instancetype) sharedInstance
{
  dispatch_once(&onceToken, ^{
    instance = [[UploadService alloc] init];
  });
  
  return instance;
}

-(void) uploadFileWithBucketId: (NSString *) bucketId
                      fileName: (NSString *) fileName
                     localPath: (NSString *) localPath
{
  dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
  STFileUploadCallback *uploadCallback = [UploadService getUploadCallbackWithWaiter : semaphore];
  
  STUploader *uploader = [[STUploader alloc] initWithBucketId: bucketId
                                                    localPath: localPath
                                                     fileName: fileName
                                             callbackNotifier: uploadCallback];
  
  UploadTask uploadTask = ^
  {
    if([uploader isUploadValid])
    {
      [uploader startUpload];
      dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
    }
  };
  
  dispatch_async(workerQueue, uploadTask);
}

-(void) syncFileWithSyncEntryId: (int) syncEntryId
                       bucketId: (NSString *) bucketId
                       fileName: (NSString *) fileName
                      localPath: (NSString *) localPath
{
  UploadTask syncTask = ^
  {
    
  };
  
  dispatch_async(syncQueue, syncTask);
}

-(void) clean
{
  //dispatch_release(workerQueue);
  //dispatch_release(syncQueue);
}

+(STFileUploadCallback *) getUploadCallbackWithWaiter: (dispatch_semaphore_t) semaphore
{
  STFileUploadCallback *uploadCallback = [[STFileUploadCallback alloc] init];
  
  uploadCallback._uploadCompleteBlock = ^(long fileHandle, NSString *fileId) {
    NSDictionary *bodyDict = @{UploadFileContract.FILE_HANDLE:@(fileHandle),
                               FileContract.FILE_ID : [DictionaryUtils checkAndReturnNSString:
                                                       fileId]};
    [Logger log:[NSString stringWithFormat:@"Sending success event for Upload Complete %@, ", bodyDict]];
    [[StorjBackgroundServices sharedInstance] sendEventWithName:EventNames.EVENT_FILE_UPLOAD_SUCCESSFULLY
                       body:bodyDict];
    
    dispatch_semaphore_signal(semaphore);
  };
  
  uploadCallback._uploadProgressBlock = ^(long fileHandle, double uploadProgress, double uploadedBytes) {
    NSDictionary *body = @{UploadFileContract.FILE_HANDLE : @(fileHandle),
                           UploadFileContract.PROGRESS : @(uploadProgress),
                           UploadFileContract.UPLOADED : @(uploadedBytes)};
    [Logger log:[NSString stringWithFormat:@"File upload progress: %@", body]];
    [[StorjBackgroundServices sharedInstance]  sendEventWithName:EventNames.EVENT_FILE_UPLOAD_PROGRESS
                       body: body];
  };
  
  uploadCallback._uploadErrorBlock = ^(long fileHandle, int errorCode, NSString *errorMessage) {
    [Logger log:[NSString stringWithFormat:@"onError: %d, %@", errorCode, errorMessage]];
    [[StorjBackgroundServices sharedInstance]  sendEventWithName:EventNames.EVENT_FILE_UPLOAD_ERROR
                       body:@{@"errorMessage":errorMessage,
                              @"errorCode" : @(errorCode),
                              UploadFileContract.FILE_HANDLE: @(fileHandle)}];
    
    dispatch_semaphore_signal(semaphore);
  };
  
  uploadCallback._uploadStartBlock = ^(long fileHandle) {
    NSDictionary *eventDict =@{@"fileHandle": @(fileHandle)};
    [Logger log:[NSString stringWithFormat:@"Upload Started: %@", eventDict]];
    [[StorjBackgroundServices sharedInstance]  sendEventWithName:EventNames.EVENT_FILE_UPLOAD_START
                       body:eventDict];
  };
  
  return uploadCallback;
}

@end
