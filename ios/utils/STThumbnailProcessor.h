//
//  STThumbnailProcessor.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 4/25/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import UIKit;
@class SingleResponse;
@class STFileRepository;

#define THUMBNAIL_SIZE 64
@interface STThumbnailProcessor : NSObject

@property (nonatomic, strong) STFileRepository *_fileRepository;

-(STThumbnailProcessor *) initWithFileRepository: (STFileRepository *) fileRepository;

-(SingleResponse *) getThumbnailWithFileId: (NSString *) fileID
                                  filePath: (NSString *) filePath;

-(SingleResponse *) getThumbnailWithFilePath: (NSString *) filePath;

@end
