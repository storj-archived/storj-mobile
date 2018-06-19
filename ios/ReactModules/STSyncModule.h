//
//  STSyncModule.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/28/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

#import "STDatabaseFactory.h"
#import "BaseRepository.h"
#import "STBucketRepository.h"
#import "STFileRepository.h"
#import "STUploadFileRepository.h"
#import "SyncQueueRepository.h"

#import "STBucketModel.h"

#import "Response.h"
#import "ListResponse.h"
#import "SingleResponse.h"

#import "MethodHandler.h"
#import "DictionaryUtils.h"

@interface STSyncModule : NSObject<RCTBridgeModule>

@property (nonatomic, strong) FMDatabase *_database;
@property (nonatomic, strong) STBucketRepository *_bucketRepository;
@property (nonatomic, strong) STFileRepository *_fileRepository;
@property (nonatomic, strong) STUploadFileRepository *_uploadFileRepository;
@property (nonatomic, strong) SyncQueueRepository *_syncQueueRepository;


@end
