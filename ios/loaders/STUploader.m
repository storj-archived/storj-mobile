//
//  STUploader.m
//  StorjMobile
//
//  Created by Barterio on 5/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STUploader.h"

@import StorjIOS;

#import "UploadFileModel.h"
#import "FileModel.h"

#import "FileUtils.h"

#import "UploadFileRepository.h"
#import "FileRepository.h"

#import "StorjWrapperSingletone.h"

#import "STFileUploadCallback.h"

#import "ThumbnailProcessor.h"

#import "Logger.h"

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
  
  UploadFileRepository *_uploadFileRepository;
  FileRepository *_fileRepository;
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

-(UploadFileRepository *) _uploadFileRepository
{
  if(!_uploadFileRepository)
  {
    _uploadFileRepository = [[UploadFileRepository alloc] init];
  }
  
  return _uploadFileRepository;
}

-(FileRepository *) _fileRepository
{
  if(!_fileRepository)
  {
    _fileRepository = [[FileRepository alloc] init];
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
  NSNumber *fileSize = [FileUtils getFileSizeWithPath:_localPath];
  NSString *fileName = [FileUtils getFileNameWithPath:_localPath];
  
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
    
    [_uploadFileDbo set_progress: _uploadProgress];
    [_uploadFileDbo set_uploaded: uploadedBytes];
    
    UploadFileModel * fileModel =[[UploadFileModel alloc] initWithUploadFileDbo:_uploadFileDbo];
    Response *response = [[self _uploadFileRepository] updateByModel:fileModel];
    if(_notifyUploadFileCallback)
    {
      [_notifyUploadFileCallback uploadProgressWithFileHandle: [_uploadFileDbo fileHandle]
                                                uploadProgres: _uploadProgress
                                                  uploadBytes: uploadedBytes];
    }
  };
  
  _innerUploadFileCallback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    NSString *dboId = [NSString stringWithFormat:@"%ld", [_uploadFileDbo fileHandle]];
    Response *deleteResponse = [[self _uploadFileRepository] deleteById:dboId];
    
    [self deleteFile];
    
    [_notifyUploadFileCallback errorWithFileHandle:[_uploadFileDbo fileHandle]
                                         errorCode:errorCode
                                      errorMessage:errorMessage];
  };
  
  _innerUploadFileCallback.onSuccess = ^(SJFile * file){
    ThumbnailProcessor *thumbnailProcessor = [[ThumbnailProcessor alloc]
                                              initWithFileRepository:[self _fileRepository]];
    NSString *thumbnail = nil;
    // Due to the fact that StorjLib returns mimeType: applicatio9n/octet-stream, we are trying to
    // generate thumbnail image and save it to local database
    SingleResponse *thumbnailGenerationResponse = [thumbnailProcessor getThumbnailWithFilePath:_localPath];
    if([thumbnailGenerationResponse isSuccess])
    {
      thumbnail = [thumbnailGenerationResponse getResult];
    }
    
    FileModel *fileModel = [[FileModel alloc] initWithSJFile:file
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
  
  long fileRef = [[self _storjWrapper] uploadFile:_localPath
                                         toBucket:_bucketId
                                   withCompletion:_innerUploadFileCallback];
  @synchronized (_uploadFileDbo)
  {
    [_uploadFileDbo set_fileHandle:fileRef];
    UploadFileModel *fileModel = [[UploadFileModel alloc] initWithUploadFileDbo:_uploadFileDbo];
    
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
