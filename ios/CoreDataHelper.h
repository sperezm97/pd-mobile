//
//  CoreDataHelper.h
//
//
//  Created by John Gazzini on 7/16/21.
//

#ifndef CoreDataHelper_h
#define CoreDataHelper_h

#import <CoreData/CoreData.h>

@interface CoreDataHelper: NSObject <NSFetchedResultsControllerDelegate>

//This returns the singleton
+(id)sharedManager;

//@property (nonatomic, retain) NSFetchedResultsController *fetchedResultsController;
@property (nonatomic, retain) NSManagedObjectContext *managedObjectContext;
@property (readonly, strong, nonatomic) NSManagedObjectModel *managedObjectModel;
@property (readonly, strong, nonatomic) NSPersistentStoreCoordinator *persistentStoreCoordinator;

- (NSArray *)getAllPools;

@end

#endif /* CoreDataHelper_h */
