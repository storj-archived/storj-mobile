//
//  StorjLibIos.m
//  StorjMobile
//
//  Created by Barterio on 1/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "StorjLibIos.h"
@import StorjIOS;

@interface StorjLibIos()
@property (nonatomic, strong) StorjWrapper *storjWrapper;
@end

#define KEY_IS_SUCCESS "isSuccess"
#define KEY_RESULT "result"
#define KEY_ERROR_MESSAGE "errorMessage"

#define RESOLVER "RCTresolver"
#define REJECTER "RCTrejecter"

@implementation StorjLibIos
@synthesize _database, _uploadFileRepository, _fileRepository;

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents{
  return @[@"uploadFile"];
}

-(FMDatabase *) database{
  if(!_database){
    _database = [[DatabaseFactory getSharedDatabaseFactory] getSharedDb];
  }
  return _database;
}

-(UploadFileRepository *) uploadFileRepository{
  if(!_uploadFileRepository){
    _uploadFileRepository = [[UploadFileRepository alloc] initWithDB:[self database]];
  }
  return _uploadFileRepository;
}

-(FileRepository *) fileRepository{
  if(!_fileRepository){
    _fileRepository = [[FileRepository alloc] initWithDB:[self database]];
  }
  return _fileRepository;
}


-(StorjWrapper *)storjWrapper{
  if(!_storjWrapper){
    _storjWrapper = [[StorjWrapperSingletone sharedStorjWrapper]storjWrapper];
  }
  return _storjWrapper;
}

#pragma mark - Mnemonic requests
RCT_REMAP_METHOD(generateMnemonic,
                 generateMnemonicWithResolver:(RCTPromiseResolveBlock)resolver
                 rejecter:(RCTPromiseRejectBlock)rejecter){
  
  [MethodHandler
   invokeParallelWithParams:@{@RESOLVER: resolver,
                               @REJECTER : rejecter}
   andMethodHandlerBlock:^(NSDictionary * params){
     NSString *mnemonic = [self.storjWrapper generateMnemonic:256];
     BOOL isSuccess = mnemonic && [mnemonic length] > 0;
     RCTPromiseResolveBlock resolve = params[@RESOLVER];
     
     resolve([[[SingleResponse alloc] initWithSuccess:isSuccess
                                          withResult:mnemonic
                                     andErrorMessage:nil]toDictionary]);
   }];
}

RCT_REMAP_METHOD(checkMnemonic,
                 checkMnemonic:(NSString *) mnemonic
                 resolver:(RCTPromiseResolveBlock)resolver
                 rejecter:(RCTPromiseRejectBlock)rejecter)
{
  
  [MethodHandler
   invokeParallelWithParams:@{@RESOLVER: resolver,
                               @REJECTER : rejecter}
   andMethodHandlerBlock:^(NSDictionary * params){
     BOOL isMnemonicValid = [self.storjWrapper checkMnemonic:mnemonic];
     RCTPromiseResolveBlock resolve = params[@RESOLVER];
     
     resolve([[[Response alloc] initWithSuccess:isMnemonicValid
                                  andWithError:nil]toDictionary]);
   }];
}

#pragma mark - Keys requsts
RCT_REMAP_METHOD(verifyKeys,
                 verifyKeysWithEmail:(NSString *)email
                 password:(NSString *)password
                 resolver:(RCTPromiseResolveBlock)resolver
                 rejecter:(RCTPromiseRejectBlock)rejecter ){
  
  [MethodHandler
   invokeParallelWithParams:@{@RESOLVER: resolver,
                               @REJECTER : rejecter}
   andMethodHandlerBlock:^(NSDictionary * params){
     BOOL isVerificationSuccessfull = [self.storjWrapper
                                       verifyKeysWithUserEmail:email
                                       andPassword:password];
     RCTPromiseResolveBlock resolve = params[@RESOLVER];
     
     resolve([[[Response alloc] initWithSuccess:isVerificationSuccessfull
                                  andWithError:nil]toDictionary]);
   }];
}

RCT_REMAP_METHOD(keysExists,
                 keysExistWithResolver:(RCTPromiseResolveBlock)resolver
                 rejecter:(RCTPromiseRejectBlock)rejecter){
  
  [MethodHandler
   invokeParallelWithParams:@{@RESOLVER: resolver,
                               @REJECTER : rejecter}
   andMethodHandlerBlock:^(NSDictionary * params){
     BOOL areKeysExist = [self.storjWrapper authFileExist];
     RCTPromiseResolveBlock resolve = params[@RESOLVER];
     
     resolve([[[Response alloc] initWithSuccess:areKeysExist
                                  andWithError:nil]toDictionary]);
   }];
}

RCT_REMAP_METHOD(importKeys,
                 importKeysWithEmail:(NSString *)email
                 password: (NSString *)password
                 mnemonic: (NSString *) mnemonic
                 passcode: (NSString *) passcode
                 resolver:(RCTPromiseResolveBlock)resolver
                 rejecter:(RCTPromiseRejectBlock)rejecter)
{
  
  [MethodHandler
   invokeParallelWithParams:@{@RESOLVER: resolver,
                               @REJECTER : rejecter}
   andMethodHandlerBlock:^(NSDictionary * params){
     BOOL result = [self.storjWrapper importKeysWithEmail:email
                                                 password:password
                                                 mnemonic:mnemonic
                                              andPasscode:passcode];
     RCTPromiseResolveBlock resolve = params[@RESOLVER];
     
     resolve([[[Response alloc] initWithSuccess:result
                                   andWithError:nil]toDictionary]);
   }];
}


RCT_EXPORT_METHOD(getKeys: (NSString *) passcode
                  successCallback:(RCTPromiseResolveBlock) resolver
                  errorCallback:(RCTPromiseRejectBlock) rejecter)
{
  
  [MethodHandler
   invokeParallelWithParams:@{@RESOLVER: resolver,
                               @REJECTER : rejecter}
   andMethodHandlerBlock:^(NSDictionary * params){
     NSDictionary * authCredentials = [self.storjWrapper getKeysWithPassCode:passcode];
     SingleResponse *response;
     if(!authCredentials || authCredentials.count != 3){
       response = [[SingleResponse alloc] initWithSuccess:NO
                                               withResult:nil
                                          andErrorMessage:@"Error externing keys"];
     } else{
       response  = [SingleResponse
                 successSingleResponseWithResult:[DictionaryUtils
                                                  convertToJsonWithDictionary:authCredentials]];
       
     }
     RCTPromiseResolveBlock resolve = params[@RESOLVER];
     resolve([response toDictionary]);
   }
   ];
}

RCT_REMAP_METHOD(register,
                 registerWithLogin:(NSString *)login
                 password:(NSString *)password
                 resolver:(RCTPromiseResolveBlock)resolver
                 rejecter:(RCTPromiseRejectBlock)rejecter)
{
  
  [MethodHandler
   invokeParallelWithParams:@{@RESOLVER: resolver,
                               @REJECTER : rejecter}
   andMethodHandlerBlock:^(NSDictionary * params){
     
     RegistrationCallback *callback = [[RegistrationCallback alloc] init];
     callback.onSuccess = ^(NSString *email){
       NSString * mnemonic = [_storjWrapper generateMnemonic:256];
       RCTPromiseResolveBlock resolve = params[@RESOLVER];
       resolve([[[SingleResponse alloc]initWithSuccess:YES
                                            withResult:mnemonic
                                       andErrorMessage:nil] toDictionary]);
     };
     callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
       RCTPromiseResolveBlock resolve = params[@RESOLVER];
       resolve([[[SingleResponse alloc]initWithSuccess:NO
                                            withResult:nil
                                       andErrorMessage:errorMessage] toDictionary]);
     };
   }];
}

RCT_REMAP_METHOD(uploadFile,
                 uploadFileWithBucketId:(NSString *)bucketId
                 withLocalPath:(NSString *) localPath
                 resolver:(RCTPromiseResolveBlock)resolver
                 rejecter:(RCTPromiseRejectBlock)rejecter){
  if(!bucketId || bucketId.length == 0){
    return;
  }
  
  if(!localPath || localPath.length == 0){
    return;
  }
  
  __block int uploadProgress = 0;
  long fileRef;
  NSLog(@"Uploading file located at: %@ into bucket: %@", localPath, bucketId);
  
  NSNumber *fileSize = [FileUtils getFileSizeWithPath:localPath];
  NSString *fileName = [FileUtils getFileNameWithPath:localPath];
  
  UploadFileDbo *dbo = [[UploadFileDbo alloc] initWithFileHandle:0
                                                        progress:0
                                                            size:[fileSize longValue]
                                                        uploaded:0
                                                            name:fileName
                                                             uri:localPath
                                                        bucketId:bucketId];
  
  FileUploadCallback *callback = [[FileUploadCallback alloc] init];
  
  callback.onProgress = ^(NSString *fileId, double progress, double uploadedBytes, double totalBytes) {
    int currentProgress = round(progress * 10);
    
    if(uploadProgress != currentProgress){
      uploadProgress = currentProgress;
      [dbo set_progress: uploadProgress];
      [dbo set_uploaded:uploadedBytes];
      
      UploadFileModel * fileModel =[[UploadFileModel alloc] initWithUploadFileDbo:dbo];
      Response * updateResponse = [_uploadFileRepository updateByModel:fileModel];
      
      UploadFileProgressModel *ufileProgress = [[UploadFileProgressModel alloc]
                                                initWithBucketId:bucketId
                                                filePath:localPath
                                                progress:uploadProgress
                                                uploadedBytes:uploadedBytes
                                                totalBytes:totalBytes
                                                filePointer:fileRef];
      
      [self sendEventWithName:@"uploadFile"
                         body:[ufileProgress toDictionary]];
      
      //NOTIFY IN NOTIFICATION CENTER
    }
  };
  
  callback.onSuccess = ^(NSString * fileId){
    FileModel *fileModel = [[FileModel alloc] initWithBucketId:bucketId
                                                       created:@""
                                                       erasure:@""
                                                          hmac:@""
                                                        fileId:fileId
                                                         index:@""
                                                      mimeType:@""
                                                          name:fileName
                                                          size:[fileSize longValue]
                                                   isDecrypted:YES
                                                     isStarred:NO
                                                      isSynced:NO];
    Response *deleteResponse = [_uploadFileRepository deleteById:fileId];
    Response *insertResponse = [_fileRepository insertWithModel:fileModel];
  
    resolver([SingleResponse successSingleResponseWithResult:[DictionaryUtils
                                                              convertToJsonWithDictionary:
                                                              [fileModel toDictionary]]]);
  };
  
  
  callback.onError = ^(int errorCode, NSString * _Nullable errorMessage) {
    NSString *dboId = [NSString stringWithFormat:@"%ld", [dbo fileHandle]];
    Response *deleteResponse = [_uploadFileRepository deleteById:dboId];
    
    [self sendEventWithName:@"uploadFile"
                       body:@{@"errorMessage":errorMessage,
                              @"errorCode" : @(errorCode),
                              UploadFileContract.FILE_HANDLE: dboId}];
    
    //NOTIFY IN NOTIFICATION CENTER
  };
  [self.storjWrapper uploadFile:localPath toBucket:bucketId withCompletion:callback];
  @synchronized (dbo) {
    [dbo set_fileHandle:fileRef];
    //    [dbo setProp:UploadFileContract.FILE_HANDLE fromLong:fileRef];
    UploadFileModel *fileModel = [[UploadFileModel alloc] initWithUploadFileDbo:dbo];
    Response *insertResponse = [_uploadFileRepository insertWithModel:fileModel];
    if([insertResponse isSuccess]){
      [self sendEventWithName:@"uploadFile"
                         body:@{@"fileHandle": @([dbo fileHandle])}];
    }
  }
}

-(void) arrayShift:(NSMutableArray *) array position:(int)position length:(int) length{
  while(position < length -1){
    array[position] = array[position + 1];
    position++;
  }
}

@end


