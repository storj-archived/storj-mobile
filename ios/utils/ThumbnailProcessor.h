//
//  ThumbnailProcessor.h
//  StorjMobile
//
//  Created by Barterio on 4/25/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import UIKit;
@class SingleResponse;
@class FileRepository;

#define THUMBNAIL_SIZE 64
@interface ThumbnailProcessor : NSObject

@property (nonatomic, strong) FileRepository *_fileRepository;

-(ThumbnailProcessor *) initWithFileRepository: (FileRepository *) fileRepository;

-(SingleResponse *) getThumbnailWithFileId: (NSString *) fileID
                                  filePath: (NSString *) filePath;

-(SingleResponse *) getThumbnailWithFilePath: (NSString *) filePath;

@end
