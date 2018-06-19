//
//  STFileManager.h
//  StorjMobile
//
//  Created by Developer Mac on 30.05.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;

@class STAssetFileModel;

#ifndef STFileManager_h
#define STFileManager_h

@interface STFileManager : NSObject

-(instancetype) init;

-(NSMutableArray <STAssetFileModel *> *) getAssetsFromGallery;

-(NSString *) getUploadFolder;

-(NSString *) getDownloadFolder;

@end

#endif /* STFileManager_h */
