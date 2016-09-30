//
//  BackToBasics
//

#import "Authentication.h"


@interface Authentication()
{
    KeychainItemWrapper* currentUser;
    CDVInvokedUrlCommand * command;
}
@end

@implementation Authentication

- (void) login:(CDVInvokedUrlCommand *)cmd
{
    command = cmd;
    AuthController *auth = [AuthController sharedInstance];
    [auth initialize];
    currentUser = [[KeychainItemWrapper alloc] initWithIdentifier:@"Login" accessGroup:nil];
    [currentUser resetKeychainItem];
    auth.delegate = self;
    auth._userName = [command.arguments objectAtIndex:0];
    auth._passWord = [command.arguments objectAtIndex:1];
    [currentUser setObject:[command.arguments objectAtIndex:0] forKey:(id)(kSecAttrAccount)];
    [auth authenticate];
}

- (void)authorized
{
    AuthController *auth = [AuthController sharedInstance];
    
    // Create an object with a simple success property.
    NSDictionary *jsonObj = [ [NSDictionary alloc]
                             initWithObjectsAndKeys :
                             auth._userName, @"username",
                             [auth getToken], @"accessToken",
                             [auth getRefreshToken], @"refreshToken",
                             @"300" , @"expiresIn",
                             auth._grantType,@"granttype",
                             nil
                             ];
    CDVPluginResult *pluginResult = [ CDVPluginResult
                                     resultWithStatus    : CDVCommandStatus_OK
                                     messageAsDictionary : jsonObj
                                     ];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)authenticationError:(NSString*)errorTitle andDescription:(NSString*)errorDescription
{
    // Create an object with a simple success property.
    CDVPluginResult *pluginResult = [ CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorDescription];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}

- (void)userStatusChanged
{
    
}


@end
