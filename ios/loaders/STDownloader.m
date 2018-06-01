//
//  STDownloader.m
//  StorjMobile
//
//  Created by Barterio on 5/30/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "STDownloader.h"

#import "FileModel.h"
#import "DownloadFileModel.h"

#import "FileDbo.h"
#import "UploadFileDbo.h"

#import "FileRepository.h"
#import "UploadFileRepository.h"

#import "FileUtils.h"
#import "StorjWrapperSingletone.h"
#import "ThumbnailProcessor.h"
#import "Logger.h"

#import "STFileDownloadCallback.h"

#import "SingleResponse.h"

@implementation STDownloader
{
  FileDbo *_fileDbo;
  
  NSString *_fileId;
  NSString *_bucketId;
  NSString *_localPath;
  
  SJFileDownloadCallback *_innerDownloadFileCallback;
  STFileDownloadCallback *_notifyDownloadFileCallback;
  
  double _downloadProgress;
  
  StorjWrapper *_storjWrapper;
  
  FileRepository *_fileRepository;
  
  BOOL _isDownloadComplete;
}

-(instancetype) initWithFileId: (NSString *) fileId
                      bucketId: (NSString *) bucketId
                     localPath: (NSString *) localPath
              callbackNotifier: (STFileDownloadCallback *) fileDownloadCallback
{
  if(self = [super init])
  {
    _fileId = fileId;
    _bucketId = bucketId;
    _localPath = localPath;
    _notifyDownloadFileCallback = fileDownloadCallback;
  }
  return self;
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

-(BOOL) isDownloadValid
{
  return _fileId && _fileId.length > 0
  && _bucketId && _bucketId.length > 0
  && _localPath && _localPath.length > 0;
}

-(void) startDownload
{
  if(![self isDownloadValid])
  {
    _isDownloadComplete = YES;
    //Notify about error
    return;
  }
  
  _downloadProgress = 0;
  [Logger log: [NSString stringWithFormat:@"Downloading \nfile %@ \nfrom %@ \nto %@",
                _fileId, _bucketId, _localPath]];
  
  _fileDbo = [[self _fileRepository] getByFileId:_fileId];
  if(!_fileDbo)
  {
    //Notify about error
    return;
  }
  
  SJFileDownloadCallback *callback = [[SJFileDownloadCallback alloc]init];
  
  callback.onDownloadProgress = ^(NSString *fileId, double progress, double downloadedBytes,
                                  double totalBytes)
  {
    if([_fileDbo _fileHandle] == 0)
    {
      return;
    }
    if(progress == 0)
    {
      return;
    }
    if(progress - _downloadProgress > 0.02)
    {
      _downloadProgress = progress;
    }
    if(_downloadProgress != progress)
    {
      return;
    }
    
    [_notifyDownloadFileCallback downloadProgressWithFileId:fileId
                                                 fileHandle:[_fileDbo _fileHandle]
                                           downloadProgress:progress];
  };
  
  callback.onDownloadComplete = ^(NSString *fileId, NSString *localPath)
  {
    Response *updateResponse =[[self _fileRepository] updateById:fileId
                                                   downloadState:2
                                                      fileHandle:0
                                                         fileUri:localPath];
    if([updateResponse isSuccess])
    {

      ThumbnailProcessor *thumbnailProcessor = [[ThumbnailProcessor alloc]
                                                initWithFileRepository:[self _fileRepository]];
      SingleResponse *thumbnailResponse = [thumbnailProcessor getThumbnailWithFileId:fileId
                                                                            filePath:localPath];
      
      NSString *thumbnail;
      if([thumbnailResponse isSuccess])
      {
        thumbnail = [thumbnailResponse getResult];
      }
      
      [_notifyDownloadFileCallback downloadCompleteWithFileId:fileId
                                                     filePath:localPath
                                                    thumbnail:thumbnail];
      _isDownloadComplete = YES;
    }
  };
  
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage)
  {
    Response* updateResponse = [[self _fileRepository] updateById:_fileId
                                                    downloadState:0
                                                       fileHandle:0
                                                          fileUri:nil];
    if([updateResponse isSuccess])
    {
      [_notifyDownloadFileCallback errorWithFileId:_fileId
                                         errorCode:errorCode
                                      errorMessage:errorMessage];
    }
    _isDownloadComplete = YES;
  };
  
  long fileRef = [[self _storjWrapper] downloadFile:_fileId
                                 fromBucket:_bucketId
                                  localPath:_localPath
                             withCompletion:callback];
  @synchronized (_fileDbo)
  {
    if(fileRef == 0 || fileRef == -1)
    {
      [Logger log:@"File download is not started. FileRef == -1"];
      return;
    }
    [_fileDbo set_fileHandle: fileRef];
    if([[[self _fileRepository] updateById: _fileId
                            downloadState:1
                               fileHandle:[_fileDbo _fileHandle]
                                  fileUri:nil] isSuccess])
    {
      [_notifyDownloadFileCallback downloadStartWithFileId:_fileId
                                                fileHandle:[_fileDbo _fileHandle]];
      _isDownloadComplete = NO;
    }
  }
}

-(BOOL) isDownloadComplete
{
  return NO;
}

@end
