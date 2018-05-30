//
//  STDownloader.h
//  StorjMobile
//
//  Created by Barterio on 5/30/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FileDbo.h"
#import "UploadFileDbo.h"
#import "UploadFileRepository.h"
#import "FileRepository.h"

@class STFileDownloadCallback;

@interface STDownloader : NSObject

-(instancetype) initWithFileId: (NSString *) fileId
                      bucketId: (NSString *) bucketId
                     localPath: (NSString *) localPath
              callbackNotifier: (STFileDownloadCallback *) fileDownloadCallback;

-(BOOL) isDownloadValid;

-(void) startDownload;

-(BOOL) isDownloadComplete;

@end
