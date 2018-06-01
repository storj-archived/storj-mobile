//
//  DownloadFileProgressModel.h
//  StorjMobile
//
//  Created by Barterio on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
#import "IConvertibleToJS.h"

#define DOWNLOAD_FILE_PROGRESS_MODEL_BUCKET_ID "bucketId"
#define DOWNLOAD_FILE_PROGRESS_MODEL_FILE_ID "fileId"
#define DOWNLOAD_FILE_PROGRESS_MODEL_FILE_PATH "filePath"
#define DOWNLOAD_FILE_PROGRESS_MODEL_PROGRESS "progress"
#define DOWNLOAD_FILE_PROGRESS_MODEL_UPLOADED_BYTES "uploadedBytes"
#define DOWNLOAD_FILE_PROGRESS_MODEL_TOTAL_BYTES "totalBytes"
#define DOWNLOAD_FILE_PROGRESS_MODEL_FILE_POINTER "filePointer"

@interface DownloadFileProgressModel : NSObject<IConvertibleToJS>

@property (nonatomic, strong) NSString *_bucketId;
@property (nonatomic, strong) NSString *_fileId;
@property (nonatomic, strong) NSString *_filePath;
@property double _progress;
@property long _uploadedBytes;
@property long _totalBytes;
@property long _filePointer;

- (instancetype)initWithBucketId: (NSString *)bucketId
                          fileId: (NSString *)fileId
                        filePath: (NSString *)filePath
                        progress: (double) progress
                   uploadedBytes: (long) uploadedBytes
                      totalBytes: (long) totalBytes
                     filePointer: (long) filePointer;

@end
