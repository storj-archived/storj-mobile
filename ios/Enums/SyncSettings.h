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
  SyncON        = (1 << 0),
  SyncOnWifi    = (1 << 1),
  SyncOnCharge  = (1 << 2),
  SyncPhotos    = (1 << 3),
  SyncICloud    = (1 << 4)
};

#endif /* SyncSettings_h */
