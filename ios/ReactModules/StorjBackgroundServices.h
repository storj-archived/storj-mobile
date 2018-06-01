//
//  StorjBackgroundServices.h
//  StorjMobile
//
//  Created by Barterio on 3/19/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@class BucketRepository;
@class FileRepository;
@class UploadFileRepository;

@class StorjWrapper;

@interface StorjBackgroundServices : RCTEventEmitter<RCTBridgeModule>

@property (nonatomic, strong) BucketRepository *_bucketRepository;
@property (nonatomic, strong) FileRepository *_fileRepository;
@property (nonatomic, strong) UploadFileRepository *_uploadFileRepository;

@property (nonatomic, strong) StorjWrapper *_storjWrapper;

-(void) uploadFileWithBucketId: (NSString *) bucketId
                 withLocalPath: (NSString *) localPath
                      fileName: (NSString *) fileName;

@end
