//
//  StorjCallbacks.h
//  SwiftyStorj
//
//  Created by Andrea Tullis on 07/07/2017.
//  Copyright © 2017 angu2111. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void (^SJErrorCallback)(NSString * _Nullable error);

typedef void (^SJInfoCallBack)(NSDictionary * _Nullable infoDictionary,  NSError * _Nullable error);

typedef void (^SJRegisterCallBack)(NSError * _Nullable error);

typedef void (^SJBucketCreateCallBack)(NSDictionary * _Nullable bucketDictionary, NSError *_Nullable error);
typedef void (^SJBucketListCallBack)(NSArray<NSDictionary *> * _Nullable bucketsArray, NSError *_Nullable error);
typedef void (^SJBucketDeleteCallBack)(NSError *_Nullable error);

typedef void (^SJFileListCallBack)(NSArray<NSDictionary *> * _Nullable filesArray, NSError *_Nullable error);
typedef void (^SJFileDownloadCallBack)(NSData * _Nullable data, NSError *_Nullable error);
typedef void (^SJFileDeleteCallBack)(NSError *_Nullable error);
typedef void (^SJFileUploadCallBack)(NSError *_Nullable error);

