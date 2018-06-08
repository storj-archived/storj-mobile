//
//  StorjLibIos.m
//  StorjMobile
//
//  Created by Barterio on 1/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "StorjLibIos.h"
@import StorjIOS;
#import "STFileManager.h"

@interface StorjLibIos()
@property (nonatomic, strong) StorjWrapper *storjWrapper;
@end

#define KEY_IS_SUCCESS "isSuccess"
#define KEY_RESULT "result"
#define KEY_ERROR_MESSAGE "errorMessage"

#define RESOLVER "RCTresolver"
#define REJECTER "RCTrejecter"

@implementation StorjLibIos
@synthesize _uploadFileRepository, _fileRepository;

RCT_EXPORT_MODULE();

-(UploadFileRepository *) uploadFileRepository
  {
    if(!_uploadFileRepository)
    {
      _uploadFileRepository = [[UploadFileRepository alloc] init];
    }
    return _uploadFileRepository;
  }

-(FileRepository *) fileRepository
  {
    if(!_fileRepository)
    {
      _fileRepository = [[FileRepository alloc] init];
    }
    return _fileRepository;
  }

-(StorjWrapper *)storjWrapper
  {
    if(!_storjWrapper)
    {
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
     SJKeys *keys = [[SJKeys alloc] initWithEmail:email password:password mnemonic:mnemonic];
     BOOL result = [self.storjWrapper importKeys:keys andPassphrase:passcode];
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
     SJKeys * keys = [self.storjWrapper getKeysWithPassphrase:passcode];
     
     SingleResponse *response;
     if(![keys areKeysValid])
     {
       response = [[SingleResponse alloc] initWithSuccess:NO
                                               withResult:nil
                                          andErrorMessage:@"Error externing keys"];
     } else{
       response  = [SingleResponse
                 successSingleResponseWithResult:[DictionaryUtils
                                                  convertToJsonWithDictionary:[keys toDictionary]]];
       
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
     
     SJRegistrationCallback *callback = [[SJRegistrationCallback alloc] init];
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

RCT_REMAP_METHOD(deleteKeys,
                 deleteKeysWithResolver: (RCTPromiseResolveBlock) resolver
                 rejecter: (RCTPromiseRejectBlock) rejecter){
  [MethodHandler invokeParallelWithParams:@{@RESOLVER: resolver,
                                             @REJECTER : rejecter}
                    andMethodHandlerBlock:^(NSDictionary * _Nonnull param) {
                      RCTPromiseResolveBlock resolve = param[@RESOLVER];
                      resolve([[[Response alloc] initWithSuccess:[[self storjWrapper] deleteAuthFile]
                                             andWithErrorMessage:@""]toDictionary]);
                    }];
}

RCT_REMAP_METHOD(cancelUpload,
                 cancelUploadByFileRef:(double)fileRef
                 resolver:(RCTPromiseResolveBlock) resolve
                 rejecter:(RCTPromiseRejectBlock) reject){
  
  if(fileRef == 0 || fileRef == -1){
    resolve([[Response errorResponseWithMessage:@"File uploading is not started"] toDictionary]);
    return;
  }
  [MethodHandler
   invokeParallelWithParams:@{@"resolver":resolve, @"rejecter":reject}
   andMethodHandlerBlock:^(NSDictionary * _Nonnull param) {
     RCTPromiseResolveBlock resolver = param[@"resolver"];
     resolver([[self storjWrapper] cancelUpload:(long)fileRef]
              ? [[Response successResponse] toDictionary]
              : [[Response errorResponseWithMessage:@"Unable to cancel upload"] toDictionary]);
   }];
}

RCT_REMAP_METHOD(cancelDownload,
                 cancelDownloadByFileRef:(double)fileRef
                 resolver:(RCTPromiseResolveBlock) resolve
                 rejecter:(RCTPromiseRejectBlock) reject){
  if(fileRef == 0 || fileRef == -1){
    resolve([[Response errorResponseWithMessage:@"File downloading is not started"] toDictionary]);
    return;
  }
  [MethodHandler
   invokeParallelWithParams:@{@"resolver":resolve, @"rejecter":reject}
   andMethodHandlerBlock:^(NSDictionary * _Nonnull param) {
     RCTPromiseResolveBlock resolver = param[@"resolver"];
     resolver([[self storjWrapper] cancelDownload:(long)fileRef]
              ? [[Response successResponse] toDictionary]
              : [[Response errorResponseWithMessage:@"Unable to cancel download"] toDictionary]);
   }];
}

RCT_REMAP_METHOD(getDownloadFolderPath,
                 getDownloadFolderPathWithResolver: (RCTPromiseResolveBlock) resolver
                 andRejecter: (RCTPromiseRejectBlock) rejecter){
  [MethodHandler invokeWithParams:@{@RESOLVER: resolver,
                                     @REJECTER : rejecter}
            andMethodHandlerBlock:^(NSDictionary * _Nonnull param) {
              RCTPromiseResolveBlock resolve = param[@RESOLVER];
              STFileManager *stFileMan = [[STFileManager alloc] init];
              NSString *downloadsDir = [stFileMan getDownloadFolder];
              
              SingleResponse *response;
              if(downloadsDir || downloadsDir.length > 0)
              {
                response = [SingleResponse successSingleResponseWithResult:downloadsDir];
              } else
              {
                response = [SingleResponse errorResponseWithMessage:@"Unable to retrieve downloads folder"];
              }
              resolve([response toDictionary]);
            }];
}

-(void) arrayShift:(NSMutableArray *) array position:(int)position length:(int) length {
  while(position < length -1) {
    array[position] = array[position + 1];
    position++;
  }
}

@end


