//
//  StorjBackgroundServices.h
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>
#import "DatabaseFactory.h"
#import "BaseRepository.h"
#import "BucketRepository.h"
#import "FileRepository.h"
#import "UploadFileRepository.h"
#import "FileDeleteModel.h"
#import "UploadFileDbo.h"
#import "UploadFileModel.h"
#import "UploadFileProgressModel.h"
#import "BucketModel.h"
#import "ListResponse.h"
#import "SingleResponse.h"
#import "MethodHandler.h"
#import "DictionaryUtils.h"
#import "FileUtils.h"
#import "EventNames.h"
#import "PromiseHandler.h"
#import "StorjWrapperSingletone.h"
#import "ThumbnailProcessor.h"

@import StorjIOS;

@interface StorjBackgroundServices : RCTEventEmitter<RCTBridgeModule>

@property (nonatomic, strong) FMDatabase *_database;
@property (nonatomic, strong) BucketRepository *_bucketRepository;
@property (nonatomic, strong) FileRepository *_fileRepository;
@property (nonatomic, strong) UploadFileRepository *_uploadFileRepository;

@property (nonatomic, strong) PromiseHandler *_mainOperationsPromise;
@property (nonatomic, strong) PromiseHandler *_uploadOperationsPromise;
@property (nonatomic, strong) PromiseHandler *_downloadOperationsPromise;

@property (nonatomic, strong) StorjWrapper *_storjWrapper;

-(void) uploadFileWithBucketId:(NSString *)bucketId
                 withLocalPath:(NSString *) localPath;

@end
