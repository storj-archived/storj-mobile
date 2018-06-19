//
//  STStorjLib.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 1/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
@import Foundation;


#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>
#import "STDatabaseFactory.h"
#import "BaseRepository.h"
#import "STBucketModel.h"
#import "Response.h"
#import "ListResponse.h"
#import "SingleResponse.h"
#import "MethodHandler.h"
#import "DictionaryUtils.h"
#import "StorjWrapperSingletone.h"
#import "STUploadFileRepository.h"
#import "STFileRepository.h"
#import "STFileUtils.h"
#import "STFileModel.h"

@interface STStorjLib : NSObject<RCTBridgeModule>
@property (nonatomic, strong) FMDatabase *_database;
@property (nonatomic, strong) STUploadFileRepository *_uploadFileRepository;
@property (nonatomic, strong) STFileRepository *_fileRepository;
//@property (nonatomic) StorjWrapper *storjWrapper;
@end
