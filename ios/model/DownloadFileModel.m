//
//  DownloadFileModel.m
//  StorjMobile
//
//  Created by Barterio on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "DownloadFileModel.h"
#import "DictionaryUtils.h"

@implementation DownloadFileModel
@synthesize _fileId;
@synthesize _localPath;

-(instancetype) initWithFileId:(NSString *)fileId localPath:(NSString *)localPath{
  if(self = [super init]){
    _fileId = fileId;
    _localPath = localPath;
  }
  return self;
}

-(NSDictionary *) toDictionary{
  NSMutableDictionary *object = [[NSMutableDictionary alloc] init];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_fileId]
             forKey:@DOWNLOADING_FILE_MODEL_FILE_ID];
  [object setObject:[DictionaryUtils checkAndReturnNSString:_localPath]
             forKey:@DOWNLOADING_FILE_MODEL_LOCAL_PATH];
  return object;
}

@end
