//
//  SyncSettings.h
//  StorjMobile
//
//  Created by Barterio on 6/12/18.
//  Copyright © 2018 Storj. All rights reserved.
//

@import Foundation;
#ifndef SyncSettings_h
#define SyncSettings_h

typedef NS_OPTIONS(NSUInteger, SyncSettingsState)
{
  SyncON        = (1 << 7),
  SyncOnWifi    = (1 << 6),
  SyncOnCharge  = (1 << 5),
  SyncPhotos    = (1 << 4),
  SyncDocuments = (1 << 3)
};

#endif /* SyncSettings_h */
