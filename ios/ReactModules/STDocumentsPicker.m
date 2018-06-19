#import "STDocumentsPicker.h"

#import <React/RCTConvert.h>
#import <React/RCTBridge.h>


#define IDIOM    UI_USER_INTERFACE_IDIOM()
#define IPAD     UIUserInterfaceIdiomPad

@interface STDocumentsPicker () <UIDocumentMenuDelegate,UIDocumentPickerDelegate>
@end


@implementation STDocumentsPicker {
  RCTPromiseResolveBlock _resolveBlock;
}

@synthesize bridge = _bridge;

- (instancetype)init
{
  if ((self = [super init])) {
    
  }
  return self;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(DocumentsPickerModule)

RCT_REMAP_METHOD(show,
                 showWithDictionary: (NSDictionary *) options
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock) reject){
  
  NSArray *allowedUTIs = [RCTConvert NSArray:@[@"public.content"]];
  UIDocumentMenuViewController *documentPicker = [[UIDocumentMenuViewController alloc] initWithDocumentTypes:(NSArray *)allowedUTIs inMode:UIDocumentPickerModeImport];
  
  _resolveBlock = resolve;

  documentPicker.delegate = self;
  
//  documentPicker.allowsMultipleSelection = YES;
  documentPicker.modalPresentationStyle = UIModalPresentationFormSheet;
  
  UIViewController *rootViewController = [[[[UIApplication sharedApplication]delegate] window] rootViewController];
  while (rootViewController.modalViewController) {
    rootViewController = rootViewController.modalViewController;
  }
  
  if ( IDIOM == IPAD ) {
    NSNumber *top = [RCTConvert NSNumber:options[@"top"]];
    NSNumber *left = [RCTConvert NSNumber:options[@"left"]];
    [documentPicker.popoverPresentationController setSourceRect: CGRectMake([left floatValue], [top floatValue], 0, 0)];
    [documentPicker.popoverPresentationController setSourceView: rootViewController.view];
  }
  
  [rootViewController presentViewController:documentPicker animated:YES completion:nil];
}


- (void)documentMenu:(UIDocumentMenuViewController *)documentMenu didPickDocumentPicker:(UIDocumentPickerViewController *)documentPicker {
  documentPicker.delegate = self;
  [documentPicker setAllowsMultipleSelection:YES];
  documentPicker.modalPresentationStyle = UIModalPresentationFormSheet;
  
  UIViewController *rootViewController = [[[[UIApplication sharedApplication]delegate] window] rootViewController];
  
  while (rootViewController.modalViewController) {
    rootViewController = rootViewController.modalViewController;
  }
  if ( IDIOM == IPAD ) {
    [documentPicker.popoverPresentationController setSourceRect: CGRectMake(rootViewController.view.frame.size.width/2, rootViewController.view.frame.size.height - rootViewController.view.frame.size.height / 6, 0, 0)];
    [documentPicker.popoverPresentationController setSourceView: rootViewController.view];
  }
  
  [rootViewController presentViewController:documentPicker animated:YES completion:nil];
}

- (void)documentPicker:(UIDocumentPickerViewController *)controller didPickDocumentAtURL:(NSURL *)url {
  if (controller.documentPickerMode == UIDocumentPickerModeImport) {
    
    [url startAccessingSecurityScopedResource];
    
    NSFileCoordinator *coordinator = [[NSFileCoordinator alloc] init];
    __block NSError *error;
    
    [coordinator coordinateReadingItemAtURL:url options:NSFileCoordinatorReadingResolvesSymbolicLink error:&error byAccessor:^(NSURL *newURL) {
      NSMutableDictionary* result = [NSMutableDictionary dictionary];
      
      [result setValue:newURL.absoluteString forKey:@"path"];
      [result setValue:[newURL lastPathComponent] forKey:@"fileName"];
      
      NSError *attributesError = nil;
      NSDictionary *fileAttributes = [[NSFileManager defaultManager] attributesOfItemAtPath:newURL.path error:&attributesError];
      if(!attributesError) {
        [result setValue:[fileAttributes objectForKey:NSFileSize] forKey:@"fileSize"];
      } else {
        NSLog(@"%@", attributesError);
      }
      
      NSArray *arr = @[result];
      NSDictionary *testResult = @{
                                   @"isSuccess":@(YES),
                                   @"result": result ? arr : @[],
                                   @"errorMessage":@""};
      NSLog(@"Result: %@", testResult);
      _resolveBlock(testResult);
//      callback(@[[NSNull null], result]);
    }];
    
    [url stopAccessingSecurityScopedResource];
  }
}

@end
