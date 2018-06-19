//
//  STFileDownloadCallback.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 5/30/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

typedef void(^STDownloadProgressBlock)(NSString * fileId, long fileHandle, double progress);

typedef void(^STDownloadCompleteBlock)(NSString * fileId, NSString * filePath, NSString * thumbnail);

typedef void(^STDownloadErrorBlock)(NSString * fileId, int errorCode, NSString * errorMessage);

typedef void(^STFileDownloadStartBlock)(NSString * fileId, long fileHandle);

@interface STFileDownloadCallback : NSObject

@property (nonatomic) _Nonnull STDownloadProgressBlock _downloadProgressBlock;
@property (nonatomic) _Nonnull STDownloadCompleteBlock _downloadCompleteBlock;
@property (nonatomic) _Nonnull STDownloadErrorBlock _downloadErrorBlock;
@property (nonatomic) _Nonnull STFileDownloadStartBlock _downloadStartBlock;

-(void) downloadProgressWithFileId: (NSString *) fileId
                        fileHandle: (long) fileHandle
                  downloadProgress: (double) downloadProgress;

-(void) downloadCompleteWithFileId: (NSString *) fileId
                          filePath: (NSString *) filePath
                         thumbnail: (NSString * _Nullable) thumbnail;

-(void) errorWithFileId: (NSString *) fileId
              errorCode: (int) errorCode
           errorMessage: (NSString *) errorMessage;

-(void) downloadStartWithFileId: (NSString *) fileId
                     fileHandle: (long) fileHandle;

@end
