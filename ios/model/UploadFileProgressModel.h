//
//  UploadingFileProgressModel.h
//  StorjMobile
//
//  Created by Barterio on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "IConvertibleToJS.h"
#import "DictionaryUtils.h"

#define UPLOAD_FILE_PROGRESS_MODEL_BUCKET_ID "bucketId"
#define UPLOAD_FILE_PROGRESS_MODEL_FILE_PATH "filePath"
#define UPLOAD_FILE_PROGRESS_MODEL_PROGRESS "progress"
#define UPLOAD_FILE_PROGRESS_MODEL_UPLOADED_BYTES "uploadedBytes"
#define UPLOAD_FILE_PROGRESS_MODEL_TOTAL_BYTES "totalBytes"
#define UPLOAD_FILE_PROGRESS_MODEL_FILE_POINTER "filePointer"

@interface UploadFileProgressModel : NSObject<IConvertibleToJS>

@property (nonatomic, strong) NSString *_bucketId;
@property (nonatomic, strong) NSString *_filePath;
@property double _progress;
@property long _uploadedBytes;
@property long _totalBytes;
@property long _filePointer;

- (instancetype)initWithBucketId: (NSString *)bucketId
                        filePath: (NSString *)filePath
                        progress: (double) progress
                   uploadedBytes: (long) uploadedBytes
                      totalBytes: (long) totalBytes
                     filePointer: (long) filePointer;

@end

