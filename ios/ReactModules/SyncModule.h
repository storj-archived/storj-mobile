//
//  SyncModule.h
//  StorjMobile
//
//  Created by Barterio on 3/28/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

#import "DatabaseFactory.h"
#import "BaseRepository.h"
#import "BucketRepository.h"
#import "FileRepository.h"
#import "UploadFileRepository.h"

#import "BucketModel.h"

#import "Response.h"
#import "ListResponse.h"
#import "SingleResponse.h"

#import "MethodHandler.h"
#import "DictionaryUtils.h"

@interface SyncModule : NSObject<RCTBridgeModule>

@property (nonatomic, strong) FMDatabase *_database;
@property (nonatomic, strong) BucketRepository *_bucketRepository;
@property (nonatomic, strong) FileRepository *_fileRepository;
@property (nonatomic, strong) UploadFileRepository *_uploadFileRepository;



@end
