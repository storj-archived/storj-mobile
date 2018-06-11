//
//  SyncEntryState.h
//  StorjMobile
//
//  Created by Developer Mac on 08.06.2018.
//  Copyright © 2018 Storj. All rights reserved.
//

#ifndef SyncEntryState_h
#define SyncEntryState_h

typedef enum {
  IDLE = 0,
  PROCESSING = 1,
  ERROR = 2,
  CANCELLED = 3,
  PROCESSED = 4,
  QUEUED = 5
} SyncEntryState;

#endif /* SyncEntryState_h */
