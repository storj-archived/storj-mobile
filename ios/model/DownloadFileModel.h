//
//  DownloadFileModel.h
//  StorjMobile
//
//  Created by Barterio on 3/21/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "IConvertibleToJS.h"
#import "DictionaryUtils.h"

#define DOWNLOADING_FILE_MODEL_FILE_ID "fileId"
#define DOWNLOADING_FILE_MODEL_LOCAL_PATH "localPath"

@interface DownloadFileModel : NSObject<IConvertibleToJS>

@property (nonatomic, strong) NSString *_fileId;
@property (nonatomic, strong) NSString *_localPath;

-(instancetype) initWithFileId: (NSString *) fileId localPath: (NSString *) localPath;

@end
