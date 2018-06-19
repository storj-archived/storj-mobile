//
//  StorjBackgroundServices.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@class STBucketRepository;
@class STFileRepository;
@class STUploadFileRepository;

@class StorjWrapper;

@interface STStorjBackgroundServices : RCTEventEmitter<RCTBridgeModule>

@property (nonatomic, strong) STBucketRepository *_bucketRepository;
@property (nonatomic, strong) STFileRepository *_fileRepository;
@property (nonatomic, strong) STUploadFileRepository *_uploadFileRepository;

@property (nonatomic, strong) StorjWrapper *_storjWrapper;

-(void) uploadFileWithBucketId: (NSString *) bucketId
                 withLocalPath: (NSString *) localPath
                      fileName: (NSString *) fileName;

+(instancetype) sharedInstance;

@end
