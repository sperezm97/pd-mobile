//
//  CoreDataHelper.m
//  pooldash
//
//  Created by John Gazzini on 7/16/21.
//

#import <Foundation/Foundation.h>
#import "CoreDataHelper.h"
#import <CoreData/CoreData.h>

@implementation CoreDataHelper

@synthesize managedObjectContext = _managedObjectContext;
@synthesize managedObjectModel = _managedObjectModel;
@synthesize persistentStoreCoordinator = _persistentStoreCoordinator;
//@synthesize fetchedResultsController = __fetchedResultsController;


- (NSArray *)getAllPools {
  NSFetchedResultsController *aFetchedResultsController = [self fetchAllPools];
  return aFetchedResultsController.fetchedObjects;
}



- (NSFetchedResultsController *) fetchAllPools {
  NSFetchRequest *fetchRequest = [[NSFetchRequest alloc] init];
  // Edit the entity name as appropriate.
  NSEntityDescription *entity = [NSEntityDescription entityForName:@"Pools" inManagedObjectContext:self.managedObjectContext];
  [fetchRequest setEntity:entity];
  
  [fetchRequest setFetchBatchSize:1000];
  
  // Edit the sort key as appropriate.
  NSSortDescriptor *sortDescriptor = [[NSSortDescriptor alloc] initWithKey:@"name" ascending:YES];
  NSArray *sortDescriptors = [NSArray arrayWithObjects:sortDescriptor, nil];
  
  [fetchRequest setSortDescriptors:sortDescriptors];
  
  // Edit the section name key path and cache name if appropriate.
  // nil for section name key path means "no sections".
  NSFetchedResultsController *aFetchedResultsController = [[NSFetchedResultsController alloc] initWithFetchRequest:fetchRequest managedObjectContext:self.managedObjectContext sectionNameKeyPath:nil cacheName:@"Master"];
//  aFetchedResultsController.delegate = self;
  
  NSError *error = nil;
  
  if (![aFetchedResultsController performFetch:&error]) {
        // Replace this implementation with code to handle the error appropriately.
        // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
      NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
      abort();
  }
  
  return aFetchedResultsController;
}















+(id)sharedManager {
    static CoreDataHelper *sharedHelper = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (!sharedHelper) {
          sharedHelper = [[self alloc] init];
        }
    });
    return sharedHelper;
}


- (id)init {
    if (self = [super init]) {
      //Default Values go here!
      _managedObjectModel = [NSManagedObjectModel mergedModelFromBundles:nil];
      _persistentStoreCoordinator = [self resolvePSC];
      _managedObjectContext = [self resolveManagedObjectContext];
    }
    return self;
}

- (NSPersistentStoreCoordinator *) resolvePSC {
  NSURL *appGroupDirectory = [[NSFileManager defaultManager] containerURLForSecurityApplicationGroupIdentifier:@"group.poolapps.prod"];
  NSURL *storeUrl = [appGroupDirectory URLByAppendingPathComponent:@"pd1.sqlite"];
  
  NSError *error = nil;
  NSDictionary *options = [NSDictionary dictionaryWithObjectsAndKeys:
                           [NSNumber numberWithBool:YES], NSMigratePersistentStoresAutomaticallyOption,
                           [NSNumber numberWithBool:YES], NSInferMappingModelAutomaticallyOption, nil];
  
  NSPersistentStoreCoordinator *psc = [[NSPersistentStoreCoordinator alloc] initWithManagedObjectModel:[self managedObjectModel]];
  [psc addPersistentStoreWithType:NSSQLiteStoreType configuration:nil URL:storeUrl options:options error:&error];
  
  return psc;
}


- (NSManagedObjectContext *) resolveManagedObjectContext {
    if (_persistentStoreCoordinator != nil) {
      _managedObjectContext = [[NSManagedObjectContext alloc] initWithConcurrencyType:NSMainQueueConcurrencyType];
      [_managedObjectContext setPersistentStoreCoordinator: _persistentStoreCoordinator];
    }
    return _managedObjectContext;
}

@end
