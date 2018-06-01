//
//  STUploader.h
//  StorjMobile
//
//  Created by Barterio on 5/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
@class STFileUploadCallback;

@interface STUploader : NSObject
  
-(instancetype) initWithBucketId: (NSString *) bucketId
                       localPath: (NSString *) localPath
                        fileName: (NSString *) fileName
                callbackNotifier: (STFileUploadCallback *) fileUploadCallback;
  
-(BOOL) isUploadValid;
  
-(void) startUpload;
  
-(BOOL) isUploadComplete;
  
  @end
