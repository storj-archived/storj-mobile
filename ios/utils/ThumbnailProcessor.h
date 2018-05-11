//
//  ThumbnailProcessor.h
//  StorjMobile
//
//  Created by Barterio on 4/25/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SingleResponse.h"
#import "FileRepository.h"

#define THUMBNAIL_SIZE 64
@interface ThumbnailProcessor : NSObject

@property (nonatomic, strong) FileRepository *_fileRepository;

-(ThumbnailProcessor *) initThumbnailProcessorWithFileRepository: (FileRepository *) fileRepository;

-(SingleResponse *) getThumbnailWithFileId: (NSString *) fileID
                                  filePath: (NSString *) filePath;

-(SingleResponse *) getThumbnailWithFilePath: (NSString *) filePath;

@end
