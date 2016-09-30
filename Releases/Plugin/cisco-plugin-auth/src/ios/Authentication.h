//
//  BackToBasics
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import "AuthController.h"
#import "KeychainItemWrapper.h"

@interface Authentication : CDVPlugin <CallBackDelegate>

- (void) login:(CDVInvokedUrlCommand *)command;

@end
