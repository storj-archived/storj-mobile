//
//  StorjLibIos.h
//  StorjMobile
//
//  Created by Barterio on 1/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
@import Foundation;


#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>
#import "DatabaseFactory.h"
#import "BaseRepository.h"
#import "BucketModel.h"
#import "Response.h"
#import "ListResponse.h"
#import "SingleResponse.h"
#import "MethodHandler.h"
#import "DictionaryUtils.h"
#import "StorjWrapperSingletone.h"
#import "UploadFileRepository.h"
#import "FileRepository.h"
#import "FileUtils.h"
#import "FileModel.h"
#import "UploadFileProgressModel.h"

@interface StorjLibIos : NSObject<RCTBridgeModule>
@property (nonatomic, strong) FMDatabase *_database;
@property (nonatomic, strong) UploadFileRepository *_uploadFileRepository;
@property (nonatomic, strong) FileRepository *_fileRepository;
//@property (nonatomic) StorjWrapper *storjWrapper;
@end
