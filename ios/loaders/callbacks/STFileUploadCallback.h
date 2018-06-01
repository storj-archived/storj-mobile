//
//  STFileUploadCallback.h
//  StorjMobile
//
//  Created by Barterio on 5/29/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

typedef void(^ STUploadProgressBlock)(long fileHandle, double uploadProgress, double uploadedBytes);

typedef void(^STUploadCompleteBlock)(long fileHandle, NSString *fileId);

typedef void(^STUploadErrorBlock)(long fileHandle, int errorCode, NSString *errorMessage);

typedef void(^STUploadStartBlock)(long fileHandle);

@interface STFileUploadCallback : NSObject

@property (nonatomic) _Nonnull STUploadProgressBlock _uploadProgressBlock;
@property (nonatomic) _Nonnull STUploadCompleteBlock _uploadCompleteBlock;
@property (nonatomic) _Nonnull STUploadErrorBlock _uploadErrorBlock;
@property (nonatomic) _Nonnull STUploadStartBlock _uploadStartBlock;

-(void) uploadProgressWithFileHandle: (long) fileHandle
                       uploadProgres: (double) uploadProgress
                         uploadBytes: (double) uploadedBytes;

-(void) uploadCompleteWithFileHandle: (long) fileHandle
                              fileId: (NSString *) fileId;

-(void) errorWithFileHandle: (long) fileHandle
                  errorCode: (int) errorCode
               errorMessage: (NSString *) errorMessage;

-(void) uploadStartWithFileHandle: (long) fileHandle;

@end
