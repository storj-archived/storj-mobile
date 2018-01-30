//
//  StorjWrapper.h
//  SwiftyStorj
//
//  Created by Andrea Tullis on 06/07/2017.
//  Copyright © 2017 angu2111. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "StorjCallbacks.h"
#import "RegistrationCallback.h"
@interface StorjWrapper : NSObject

-(instancetype _Nonnull)init;

-(instancetype _Nonnull)initWithHost:(NSString *_Nonnull)host
                                port:(int) port
                                andProtocol:(NSString *_Nonnull)protocol;

///Auth stuff
-(void)setProxy:(NSString *_Nonnull)proxy;

///Bridge stuff
-(void)getBridgeInfo:(SJInfoCallBack _Nonnull )callback;
-(UInt64)getTime;

///Mnemonic stuff
-(NSString *_Nullable)generateMnemonic:(int)strength;
-(void)setMnemonic:(NSString *_Nonnull)mnemonic error:(NSError *_Nullable *__null_unspecified)error __attribute__((swift_error(nonnull_error)));
-(NSString *_Nullable)getMnemonic;

///User stuff
-(void)registerUser:(NSString * _Nonnull)username password:(NSString * _Nonnull)password registerCallback:(RegistrationCallback* _Nonnull) registrationCallback;
-(void)setUsername:(NSString *_Nonnull)username password:(NSString *_Nonnull)password;

///Bucket stuff
-(void)getBucketListWithCompletion:(SJBucketListCallBack _Nonnull)completion;
-(void)createBucket:(NSString *_Nonnull)bucketName withCompletion:(SJBucketCreateCallBack _Nonnull)completion;
-(void)deleteBucket:(NSString *_Nonnull)bucketName withCompletion:(SJBucketDeleteCallBack _Nonnull)completion;

///File stuff
-(void)listFiles:(NSString *_Nonnull) bucketId withCompletion:(SJFileListCallBack _Nonnull)completion;
-(void)uploadFile:(NSString * _Nonnull)file toBucket:(NSString * _Nonnull)bucketId withCompletion:(SJFileUploadCallBack _Nonnull)completion;
-(void)downloadFile:(NSString * _Nonnull)fileId fromBucket:(NSString * _Nonnull)bucketId withCompletion:(SJFileDownloadCallBack _Nonnull) completion;
-(void)deleteFile:(NSString *_Nonnull)fileId fromBucket:(NSString * _Nonnull)bucketId withCompletion:(SJFileDeleteCallBack _Nonnull)completion;

/// Mirror stuff
-(void)listMirrors:(NSString *_Nonnull) bucketId forFile:(NSString *_Nonnull) fileId;

@end

