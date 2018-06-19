//
//  STUploader.m
//  StorjMobile
//
//  Created by Bogdan Artemenko on 5/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STUploader.h"

#import "STUploadFileModel.h"
#import "STFileModel.h"

#import "UploadFileDbo.h"
#import "FileDbo.h"

#import "STUploadFileRepository.h"
#import "STFileRepository.h"

#import "STFileUtils.h"
#import "Logger.h"
#import "STThumbnailProcessor.h"

#import "SingleResponse.h"

#import "StorjWrapperSingletone.h"

#import "STFileUploadCallback.h"

@implementation STUploader
{
  UploadFileDbo *_uploadFileDbo;
  NSString *_bucketId;
  NSString *_localPath;
  NSString *_fileName;
  
  SJFileUploadCallback *_innerUploadFileCallback;
  STFileUploadCallback *_notifyUploadFileCallback;
  
  double _uploadProgress;
  
  StorjWrapper *_storjWrapper;
  
  STUploadFileRepository *_uploadFileRepository;
  STFileRepository *_fileRepository;
}

-(instancetype) initWithBucketId: (NSString *) bucketId
                       localPath: (NSString *) localPath
                        fileName: (NSString *) fileName
                callbackNotifier: (STFileUploadCallback *) fileUploadCallback
{
  if(self = [super init])
  {
    _bucketId = bucketId;
    _localPath = localPath;
    _fileName = fileName;
    _notifyUploadFileCallback = fileUploadCallback;
  }
  return self;
}

-(STUploadFileRepository *) _uploadFileRepository
{
  if(!_uploadFileRepository)
  {
    _uploadFileRepository = [[STUploadFileRepository alloc] init];
  }
  
  return _uploadFileRepository;
}

-(STFileRepository *) _fileRepository
{
  if(!_fileRepository)
  {
    _fileRepository = [[STFileRepository alloc] init];
  }
  
  return _fileRepository;
}

-(StorjWrapper *) _storjWrapper
{
  if(!_storjWrapper)
  {
    _storjWrapper = [[StorjWrapperSingletone sharedStorjWrapper]storjWrapper];
  }
  return _storjWrapper;
}

-(BOOL) isUploadValid
{
  return _bucketId && _bucketId.length > 0
  && _localPath && _localPath.length;
}

-(void) startUpload
{
  NSNumber *fileSize = [STFileUtils getFileSizeWithPath:_localPath];
  NSString *fileName = [STFileUtils getFileNameWithPath:_localPath];
  
  _uploadFileDbo = [[UploadFileDbo alloc] initWithFileHandle:0
                                                    progress:0
                                                        size:[fileSize longValue]
                                                    uploaded:0
                                                        name:fileName
                                                         uri:_localPath
                                                    bucketId:_bucketId];
  
  _innerUploadFileCallback = [[SJFileUploadCallback alloc] init];
  
  _innerUploadFileCallback.onProgress = ^(NSString *fileId, double progress, double uploadedBytes, double totalBytes) {
    if([_uploadFileDbo fileHandle] == 0 || progress == 0){
      return;
    }
    
    if(progress - _uploadProgress > 0.02){
      _uploadProgress = progress;
    }
    
    if(_uploadProgress != progress){
      return;
    }
    
    [_uploadFileDbo setProgress: _uploadProgress];
    [_uploadFileDbo setUploaded: uploadedBytes];
    
    STUploadFileModel * fileModel =[[STUploadFileModel alloc] initWithUploadFileDbo:_uploadFileDbo];
    Response *response = [[self _uploadFileRepository] updateByModel:fileModel];
    if(_notifyUploadFileCallback)
    {
      [_notifyUploadFileCallback uploadProgressWithFileHandle: [_uploadFileDbo fileHandle]
                                                uploadProgres: _uploadProgress
                                                  uploadBytes: uploadedBytes];
    }
  };
  
  _innerUploadFileCallback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    Response *deleteResponse = [[self _uploadFileRepository] deleteById:
                                [@([_uploadFileDbo fileHandle]) stringValue]];
    
    [self deleteFile];
    
    [_notifyUploadFileCallback errorWithFileHandle:[_uploadFileDbo fileHandle]
                                         errorCode:errorCode
                                      errorMessage:errorMessage];
  };
  
  _innerUploadFileCallback.onSuccess = ^(SJFile * file){
    STThumbnailProcessor *thumbnailProcessor = [[STThumbnailProcessor alloc]
                                              initWithFileRepository:[self _fileRepository]];
    NSString *thumbnail = nil;
    // Due to the fact that StorjLib returns mimeType: application/octet-stream, we are trying to
    // generate thumbnail image and save it to local database
    SingleResponse *thumbnailGenerationResponse = [thumbnailProcessor getThumbnailWithFilePath:_localPath];
    if([thumbnailGenerationResponse isSuccess])
    {
      thumbnail = [thumbnailGenerationResponse getResult];
    }
    
    STFileModel *fileModel = [[STFileModel alloc] initWithSJFile:file
                                                     starred:NO
                                                      synced:NO
                                               downloadState:0
                                                  fileHandle:[_uploadFileDbo fileHandle]
                                                     fileUri:@""
                                                   thumbnail:thumbnail];
    
    [fileModel set_name:[_uploadFileDbo name]];
    
    Response *deleteUploadFileResponse = [[self _uploadFileRepository]
                                          deleteById:[NSString stringWithFormat:@"%ld",
                                                      [_uploadFileDbo fileHandle]]];
    Response *insertFileResponse = [[self _fileRepository] insertWithModel:fileModel];
    
    [self deleteFile];
    
    [_notifyUploadFileCallback uploadCompleteWithFileHandle:[_uploadFileDbo fileHandle] fileId:[fileModel _fileId]];
  };
  
//  long fileRef = [[self _storjWrapper] uploadFile:_localPath
//                                         toBucket:_bucketId
//                                   withCompletion:_innerUploadFileCallback];
  
  long fileRef = [[self _storjWrapper] uploadFile: _localPath
                          toBucket: _bucketId
                          fileName: _fileName
                    withCompletion: _innerUploadFileCallback];
  
  @synchronized (_uploadFileDbo)
  {
    [_uploadFileDbo setFileHandle:fileRef];
    STUploadFileModel *fileModel = [[STUploadFileModel alloc] initWithUploadFileDbo:_uploadFileDbo];
    
    Response *insertResponse = [[self _uploadFileRepository] insertWithModel:fileModel];
    if([insertResponse isSuccess])
    {
      [_notifyUploadFileCallback uploadStartWithFileHandle:[_uploadFileDbo fileHandle]];
    }
  }
}
-(void) deleteFile
{
  NSFileManager *fileManager = [NSFileManager defaultManager];
  [_localPath stringByStandardizingPath];
  NSString *filePath = [_localPath stringByReplacingOccurrencesOfString: @"file://"
                                                             withString: @""];
  if([fileManager fileExistsAtPath:filePath])
  {
    NSError *error;
    [fileManager removeItemAtPath: filePath error: &error];
  }
}

-(BOOL) isUploadComplete
{
  return NO;
}

@end
