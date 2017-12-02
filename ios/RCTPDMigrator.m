// RCTPDMigrator.m
#import "RCTPDMigrator.h"
#import <React/RCTLog.h>
#import "CoreDataHelper.h"

@implementation RCTPDMigrator {
  bool hasListeners;
}

// To export a module named RCTPDMigrator
RCT_EXPORT_MODULE();

// Will be called when this module's first listener is added.
-(void)startObserving {
  hasListeners = YES;
  // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  hasListeners = NO;
  // Remove upstream listeners, stop unnecessary background tasks
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"num_pools", @"pool"];
}

- (void)sendNumPools:(NSNumber *)numPools {
  if (hasListeners) {
    [self sendEventWithName:@"num_pools" body:numPools];
  }
}

- (void)sendPool:(NSManagedObject *)pool {
  if (hasListeners) {
    NSDate *modifiedDate = [pool valueForKey:@"modified_at"];
    
    [self sendEventWithName:@"pool" body:@{
      @"name": [pool valueForKey:@"name"],
      @"volume": [pool valueForKey:@"volume"],
      @"isGallons": [pool valueForKey:@"isGallons"],
      @"type": [pool valueForKey:@"type"],
      @"modified_at": [self getISOStringFromDate:modifiedDate],
      @"logs": [self getRecentHistoryForPool:pool]
    }];
  }
}

- (NSArray *)getRecentHistoryForPool:(NSManagedObject *)pool {
  
  NSSortDescriptor *sortDescriptor = [[NSSortDescriptor alloc] initWithKey:@"date_created" ascending:FALSE];
  NSMutableArray *sortedLogEntries = [[NSMutableArray alloc] initWithArray:[[pool valueForKey:@"log"] sortedArrayUsingDescriptors:[NSArray arrayWithObject:sortDescriptor]]];
  
  int maxNumberOfLogEntriesToReturn = 1000;
  NSMutableArray *returnArray = [[NSMutableArray alloc] initWithCapacity:maxNumberOfLogEntriesToReturn];
  for (int i = 0; i < maxNumberOfLogEntriesToReturn; i++) {
    if (sortedLogEntries.count <= i) {
      break;
    } else {
      NSDictionary *serializedLogEntry = [self serializeLogEntry:sortedLogEntries[i]];
      [returnArray addObject:serializedLogEntry];
    }
  }
  
  return returnArray;
}

- (NSDictionary *)serializeLogEntry:(NSManagedObject *)logEntry {
  NSDate *createdDate = [logEntry valueForKey:@"date_created"];
  
  return @{
    @"notes": [logEntry valueForKey:@"notes"],
    @"readings": [self serializeReadingsForLogEntry:logEntry],
    @"treatments": [self serializeTreatmentsForLogEntry:logEntry],
    @"created_at": [self getISOStringFromDate:createdDate]
  };
}

- (NSArray *)serializeReadingsForLogEntry:(NSManagedObject *)logEntry {
  NSMutableArray *returnArray = [NSMutableArray new];
  NSArray *readings = [logEntry valueForKey:@"readings"];
  for (NSManagedObject *reading in readings) {
    [returnArray addObject:@{
      @"name": [reading valueForKey:@"name"],
      @"units": [reading valueForKey:@"units"],
      @"value": [reading valueForKey:@"value"]
    }];
  }
  return returnArray;
}

- (NSArray *)serializeTreatmentsForLogEntry:(NSManagedObject *)logEntry {
  NSMutableArray *returnArray = [NSMutableArray new];
  NSArray *treatments = [logEntry valueForKey:@"treatments"];
  for (NSManagedObject *treatment in treatments) {
    [returnArray addObject:@{
      @"name": [treatment valueForKey:@"cheimcal"],
      @"units": [treatment valueForKey:@"units"],
      @"amount": [treatment valueForKey:@"amount"]
    }];
  }
  return returnArray;
}

- (NSString *)getISOStringFromDate:(NSDate *)date {
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  NSLocale *enUSPOSIXLocale = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
  [dateFormatter setLocale:enUSPOSIXLocale];
  [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ssZZZZZ"];
  [dateFormatter setCalendar:[NSCalendar calendarWithIdentifier:NSCalendarIdentifierGregorian]];

  return [dateFormatter stringFromDate:date];
}

RCT_EXPORT_METHOD(countPools) {
  NSNumber *totalPools = @([[[CoreDataHelper sharedManager] getAllPools] count]);
  [self sendNumPools:totalPools];
}

RCT_EXPORT_METHOD(importAllPools) {
  NSArray *pools = [[CoreDataHelper sharedManager] getAllPools];
  for (NSManagedObject *p in pools) {
    [self sendPool:p];
  }
}

RCT_EXPORT_METHOD(countPools:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSNumber *totalPools = @([[[CoreDataHelper sharedManager] getAllPools] count]);
  resolve(totalPools);
}

@end
