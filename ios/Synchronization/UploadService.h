//
//  UploadService.h
//  StorjMobile
//
//  Created by Developer Mac on 01.06.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

#ifndef UploadService_h
#define UploadService_h

@interface UploadService : NSObject

+(instancetype) sharedInstance;

-(void) uploadFileWithBucketId: (NSString *) bucketId
                      fileName: (NSString *) fileName
                     localPath: (NSString *) localPath;

-(void) syncFileWithSyncEntryId: (int) syncEntryId
                       bucketId: (NSString *) bucketId
                       fileName: (NSString *) fileName
                      localPath: (NSString *) localPath;
-(void) clean;

@end

#endif /* UploadService_h */
