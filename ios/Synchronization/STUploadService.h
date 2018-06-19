//
//  STUploadService.h
//  StorjMobile
//
//  Created by Yaroslav Vorobiov on 01.06.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

#ifndef STUploadService_h
#define STUploadService_h

@import Foundation;

@interface STUploadService : NSObject

+(instancetype) sharedInstance;

-(void) uploadFileWithBucketId: (NSString *) bucketId
                      fileName: (NSString *) fileName
                     localPath: (NSString *) localPath;

-(void) syncFileWithSyncEntryId: (int) syncEntryId
                       bucketId: (NSString *) bucketId
                       fileName: (NSString *) fileName
                      localPath: (NSString *) localPath;

-(void) cancelSyncEntry: (int) syncEntryId;

-(void) clean;

@end

#endif /* STUploadService_h */
