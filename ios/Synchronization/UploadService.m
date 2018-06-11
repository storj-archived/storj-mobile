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
#import "SyncQueueRepository.h"
#import "Response.h"
#import "DictionaryUtils.h"

typedef void (^UploadTask)(void);
typedef void (^UpdateDboBlock)(SyncQueueEntryDbo *);

static SyncQueueRepository *syncRepo;
static UploadService *instance = nil;
static dispatch_once_t onceToken;

@interface SyncTask : NSObject
  @property (atomic) int entryId;
  @property (atomic) bool isCancelled;
@end

@implementation SyncTask
-(instancetype) initWithSyncEntryId: (int) syncEntryId
{
  if(self = [super init])
  {
    _entryId = syncEntryId;
  }
  
  return self;
}
@end

@implementation UploadService
{
  @private
  dispatch_queue_t workerQueue;
  dispatch_queue_t syncQueue;
  NSMutableArray *syncQueueArray;
}

-(instancetype) init
{
  if(self = [super init])
  {
    workerQueue = dispatch_queue_create("io.storj.mobile.workerUpload.queue", DISPATCH_QUEUE_SERIAL);
    
    syncQueue = dispatch_queue_create("io.storj.mobile.syncUpload.queue", DISPATCH_QUEUE_SERIAL);
    syncQueueArray = [[NSMutableArray alloc] initWithCapacity: 10];
  }
  
  return self;
}

+(instancetype) sharedInstance
{
  dispatch_once(&onceToken, ^{
    instance = [[UploadService alloc] init];
    syncRepo = [[SyncQueueRepository alloc] init];
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
 
  __block SyncTask *syncTaskObj = [self schedule: syncEntryId];
  
  dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
  STFileUploadCallback *uploadCallback = [UploadService getSyncCallbackWithWaiter:(dispatch_semaphore_t) semaphore syncEntryId: syncEntryId];
  
  STUploader *uploader = [[STUploader alloc] initWithBucketId: bucketId
                                                    localPath: localPath
                                                     fileName: fileName
                                             callbackNotifier: uploadCallback];
  
  UploadTask syncTask = ^
  {
    [syncQueueArray removeObject:(id) syncTaskObj];
    
    if(syncTaskObj.isCancelled)
    {
      return;
    }
    
    if([uploader isUploadValid])
    {
      [uploader startUpload];
      dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
    }
  };
  
  dispatch_async(syncQueue, syncTask);
}

-(SyncTask *) schedule: (int) syncEntryId
{
  SyncTask *syncTask = [[SyncTask alloc] initWithSyncEntryId: syncEntryId];
  
  [self cancelSyncEntry: syncEntryId];
  [syncQueueArray addObject: syncTask];
  return syncTask;
}

-(void) cancelSyncEntry: (int) syncEntryId
{
  NSPredicate *predicate = [NSPredicate predicateWithBlock:^BOOL(id  _Nullable evaluatedObject, NSDictionary<NSString *,id> * _Nullable bindings) {
    if(!evaluatedObject)
    {
      return NO;
    }
    
    SyncTask *_syncTask = (SyncTask *)evaluatedObject;
    
    if(_syncTask.entryId == syncEntryId)
    {
      [_syncTask setIsCancelled: YES];
    }
    
    return YES;
  }];
  
  [syncQueueArray filterUsingPredicate:(NSPredicate *) predicate];
}

+(STFileUploadCallback *) getUploadCallbackWithWaiter: (dispatch_semaphore_t) semaphore
{
  __block STFileUploadCallback *uploadNotifyCallback = [UploadService getUploadNotifyCallback];
  STFileUploadCallback *uploadCallback = [[STFileUploadCallback alloc] init];
  
  uploadCallback._uploadCompleteBlock = ^(long fileHandle, NSString *fileId) {
    uploadNotifyCallback._uploadCompleteBlock(fileHandle, fileId);
    dispatch_semaphore_signal(semaphore);
  };
  
  uploadCallback._uploadErrorBlock = ^(long fileHandle, int errorCode, NSString *errorMessage) {
    uploadNotifyCallback._uploadErrorBlock(fileHandle, errorCode, errorMessage);
    dispatch_semaphore_signal(semaphore);
  };
  
  uploadCallback._uploadProgressBlock = uploadNotifyCallback._uploadProgressBlock;
  uploadCallback._uploadStartBlock = uploadNotifyCallback._uploadStartBlock;
  
  return uploadCallback;
}

+(STFileUploadCallback *) getSyncCallbackWithWaiter: (dispatch_semaphore_t) semaphore
                                        syncEntryId: (int) syncSyncEntryId
{
  STFileUploadCallback *uploadCallback = [[STFileUploadCallback alloc] init];
  __block STFileUploadCallback *uploadNotifyCallback = [UploadService getUploadNotifyCallback];
  __block SyncQueueEntryModel *syncModel = nil;
  __block long _fileHandle = -1;
  
  void (^updateDbo)(UpdateDboBlock) = ^(UpdateDboBlock callback)
  {
    if(!syncModel)
    {
      return;
    }
    
    SyncQueueEntryDbo *dbo = [syncModel toDbo];
    callback(dbo);
    
    if([[syncRepo updateWithModel: [[SyncQueueEntryModel alloc] initWithDbo:(SyncQueueEntryDbo *) dbo]] isSuccess])
    {
      [[StorjBackgroundServices sharedInstance]  sendEventWithName:EventNames.EVENT_SYNC_ENTRY_UPDATED
                                                              body:@{@"syncEntryId":@(syncSyncEntryId)}];
    }
  };
  
  uploadCallback._uploadStartBlock = ^(long fileHandle)
  {
    uploadNotifyCallback._uploadStartBlock(fileHandle);
    
    _fileHandle = fileHandle;
    syncModel = [syncRepo getById: syncSyncEntryId];
    
    updateDbo(^(SyncQueueEntryDbo *dbo)
    {
      dbo.status = 1;
      dbo.fileHandle = fileHandle;
    });
  };
  
  uploadCallback._uploadCompleteBlock = ^(long fileHandle, NSString *fileId) {
    uploadNotifyCallback._uploadCompleteBlock(fileHandle, fileId);
    
    updateDbo(^(SyncQueueEntryDbo *dbo)
    {
      dbo.status = 4;
    });
    dispatch_semaphore_signal(semaphore);
  };
  
  uploadCallback._uploadErrorBlock = ^(long fileHandle, int errorCode, NSString *errorMessage) {
    uploadNotifyCallback._uploadErrorBlock(fileHandle, errorCode, errorMessage);
    
    updateDbo(^(SyncQueueEntryDbo *dbo)
    {
      dbo.status = 2;
      dbo.errorCode = errorCode;
    });
    dispatch_semaphore_signal(semaphore);
  };
  
  uploadCallback._uploadProgressBlock = uploadNotifyCallback._uploadProgressBlock;
  return uploadCallback;
}

+(STFileUploadCallback *) getUploadNotifyCallback
{
  STFileUploadCallback *uploadCallback = [[STFileUploadCallback alloc] init];
  
  uploadCallback._uploadCompleteBlock = ^(long fileHandle, NSString *fileId) {
    NSDictionary *bodyDict = @{UploadFileContract.FILE_HANDLE:@(fileHandle),
                               FileContract.FILE_ID : [DictionaryUtils checkAndReturnNSString:
                                                       fileId]};
    [Logger log:[NSString stringWithFormat:@"Sending success event for Upload Complete %@, ", bodyDict]];
    [[StorjBackgroundServices sharedInstance] sendEventWithName:EventNames.EVENT_FILE_UPLOAD_SUCCESSFULLY
                                                           body:bodyDict];
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
  };
  
  uploadCallback._uploadStartBlock = ^(long fileHandle) {
    NSDictionary *eventDict =@{@"fileHandle": @(fileHandle)};
    [Logger log:[NSString stringWithFormat:@"Upload Started: %@", eventDict]];
    [[StorjBackgroundServices sharedInstance]  sendEventWithName:EventNames.EVENT_FILE_UPLOAD_START
                                                            body:eventDict];
  };
  
  return uploadCallback;
}

-(void) clean
{
  //dispatch_release(workerQueue);
  //dispatch_release(syncQueue);
}

@end
