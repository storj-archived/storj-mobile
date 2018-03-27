//
//  EventNames.m
//  StorjMobile
//
//  Created by Barterio on 3/26/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import "EventNames.h"

@implementation EventNames

static NSString *const _EVENT_FILE_UPLOAD_START = @"EVENT_FILE_UPLOAD_START";
static NSString *const _EVENT_FILE_UPLOAD_PROGRESS = @"EVENT_FILE_UPLOADED_PROGRESS";
static NSString *const _EVENT_FILE_UPLOAD_SUCCESSFULLY = @"EVENT_FILE_UPLOADED_SUCCESSFULLY";
static NSString *const _EVENT_FILE_UPLOAD_ERROR = @"EVENT_FILE_UPLOAD_ERROR";

static NSString *const _EVENT_BUCKETS_UPDATED = @"EVENT_BUCKETS_UPDATED";
static NSString *const _EVENT_FILES_UPDATED = @"EVENT_FILES_UPDATED";
static NSString *const _EVENT_BUCKET_CREATED = @"EVENT_BUCKET_CREATED";
static NSString *const _EVENT_BUCKET_DELETED = @"EVENT_BUCKET_DELETED";
static NSString *const _EVENT_FILE_DELETED = @"EVENT_FILE_DELETED";

static NSArray * _availableEvents;

+(NSString *)EVENT_FILE_UPLOAD_START {
  return _EVENT_FILE_UPLOAD_START;
}

+(NSString *) EVENT_FILE_UPLOAD_PROGRESS{
  return _EVENT_FILE_UPLOAD_PROGRESS;
}

+(NSString *) EVENT_FILE_UPLOAD_SUCCESSFULLY{
  return _EVENT_FILE_UPLOAD_SUCCESSFULLY;
}

+(NSString *) EVENT_FILE_UPLOAD_ERROR{
  return _EVENT_FILE_UPLOAD_ERROR;
}

+(NSString *) EVENT_BUCKETS_UPDATED{
  return _EVENT_BUCKETS_UPDATED;
}

+(NSString *) EVENT_FILES_UPDATED{
  return _EVENT_FILES_UPDATED;
}

+(NSString *) EVENT_BUCKET_CREATED{
  return _EVENT_BUCKET_CREATED;
}

+(NSString *) EVENT_BUCKET_DELETED{
  return _EVENT_BUCKET_DELETED;
}

+(NSString *) EVENT_FILE_DELETED{
  return _EVENT_FILE_DELETED;
}

+(NSArray *) availableEvents{
  if(!_availableEvents){
    _availableEvents = @[_EVENT_FILE_UPLOAD_START, _EVENT_FILE_UPLOAD_PROGRESS,
                         _EVENT_FILE_UPLOAD_SUCCESSFULLY, _EVENT_FILE_UPLOAD_ERROR,
                         _EVENT_BUCKETS_UPDATED, _EVENT_FILES_UPDATED, _EVENT_BUCKET_CREATED,
                         _EVENT_BUCKET_DELETED, _EVENT_FILE_DELETED];
  }
  return _availableEvents;
}

@end
