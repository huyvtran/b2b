//
//  TouchIDPlugin.m
//  BackToBasics
//
//  Created by NCR_MAC on 9/27/16.
//
//

#import "Authentication.h"

@interface Authentication ()
{
    
    CDVInvokedUrlCommand * command;
    
}

@end

@implementation Authentication

// To login the app using username and password.
-(void)touchIDAuthentication :(CDVInvokedUrlCommand *)cmd

{
    
    
    command = cmd;
    _currentUser = [self getKeychainIns];
    
    [_currentUser resetKeychainItem];
    _saveUserName= [command.arguments objectAtIndex:0];
    _savePassword = [command.arguments objectAtIndex:1];
    
    
    [self loginWithAccount:_saveUserName password:_savePassword];
    
    
    
}
- (void)loginWithAccount:(NSString*)acc password:(NSString*)pas
{
    AuthController *auth = [AuthController sharedInstance];
    [auth initialize];
    auth.delegate = self;
    auth._userName = acc;
    auth._passWord = pas;
    [auth authenticate];
    
    
}
- (BOOL)canShowDialog
{
    return ![[NSUserDefaults standardUserDefaults] boolForKey:@"isFirstTime"];
}
- (void) setCanShowDialog:(BOOL)firstTime
{
    [[NSUserDefaults standardUserDefaults] setBool:firstTime forKey:@"isFirstTime"];
}

-(void)enableTouchIDOption :(CDVInvokedUrlCommand *)cmd
{
    command = cmd;
    _currentUser = [self getKeychainIns];
    
    if([self canShowDialog])
    {
        // [_currentUser resetKeychainItem];
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Enable Touch ID"
                                                        message:@"Enter your CEC password to setup \nTouch ID for \"Back To Basics\""
                                                       delegate:self
                                              cancelButtonTitle:@"Cancel"
                                              otherButtonTitles:@"Ok",nil];
        [alert show];
        
        
    }
    else
    {
        CDVPluginResult *pluginResult = [ CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"please sign in"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        
    }
    
}
-(void) alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    if (buttonIndex == 1)
    {
        _userSelectTouchID = YES;
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"ok pressed"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        
        
    }
    else
    {
        [_currentUser resetKeychainItem];
        [_currentUser setObject:@"" forKey:CFBridgingRelease(kSecAttrAccount)];
        [_currentUser setObject:@"" forKey:CFBridgingRelease(kSecValueData)];
        
        CDVPluginResult *pluginResult = [ CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"please sign in"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        
    }
}


//To login the app using touch id functionality.
- (KeychainItemWrapper*)getKeychainIns
{
    if(!_currentUser)
        _currentUser = [[KeychainItemWrapper alloc] initWithIdentifier:@"Login" accessGroup:nil];
    return _currentUser;
    
}
-(void)loginWithTouchID :(CDVInvokedUrlCommand *)cmd
{
    
    command = cmd;
    
    AuthController *auth = [AuthController sharedInstance];
    [auth initialize];
    
    _currentUser = [self getKeychainIns];
    NSString *usrN = [_currentUser objectForKey:CFBridgingRelease(kSecAttrAccount)];
    NSString *usrP = [_currentUser objectForKey:CFBridgingRelease(kSecValueData)];
    
    if ([usrN length] >0 && [usrP length] > 0)
    {
        
        _touchIDManager = [[TouchIDManager alloc]init];
        _touchIDManager.delegate = self;
        if ([_touchIDManager canEvaluatePolicyMtd])
        {
            
            LAContext *laContext = [[LAContext alloc] init];
            laContext.localizedFallbackTitle = @"";
            [laContext evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics localizedReason:@"Please scan your fingure print now" reply:^(BOOL authOK, NSError *error) {
                if (authOK) {
                    NSLog(@"ok");
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [self touchIDSuccessCallBack];
                    });
                    
                } else {
                    dispatch_sync(dispatch_get_main_queue(), ^{
                        [self logoutAndResetApplication];
                    });
                }
            }];
        }
        else
        {
            [self touchIDSuccessCallBack];
            // Return false
            
            CDVPluginResult *pluginResult = [ CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"touch id is not enabled"];
            
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            
        }
    }
    else
    {
        
        CDVPluginResult *pluginResult = [ CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"please sign in"];
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    
    
}

-(void)touchIDSuccessCallBack
{
    // Once the touch ID is set up is successful, allow user to set up passcode. Return true
    
    _keychainUserName = [_currentUser objectForKey:CFBridgingRelease(kSecAttrAccount)];
    _keychainPassword = [_currentUser objectForKey:CFBridgingRelease(kSecValueData)];
    _saveUserName = _keychainUserName;
    _savePassword = _keychainPassword;
    [[AuthController sharedInstance] isSignedIn];
    [[AuthController sharedInstance] logOut];
    NSLog(@"%d",[[AuthController sharedInstance] isSignedIn]);
    [self loginWithAccount:_saveUserName password:_savePassword];
    
    
}

-(void)logoutAndResetApplication
{
    //Return false
    [_currentUser resetKeychainItem];
    [_currentUser setObject:@"" forKey:CFBridgingRelease(kSecAttrAccount)];
    [_currentUser setObject:@"" forKey:CFBridgingRelease(kSecValueData)];
    
    CDVPluginResult *pluginResult = [ CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"please sign in"];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


- (void)authorized
{
    //Return true
    
    if(_userSelectTouchID)
        [self setCanShowDialog:YES];
    if([self canShowDialog] == NO)
    {
        [_currentUser setObject:_saveUserName forKey:CFBridgingRelease(kSecAttrAccount)];
        [_currentUser setObject:_savePassword forKey:CFBridgingRelease(kSecValueData)];
    }
    else
    {
        [_currentUser resetKeychainItem];
        [_currentUser resetKeychainItem];
    }
    
    NSString *usrN = [_currentUser objectForKey:CFBridgingRelease(kSecAttrAccount)];
    NSString *usrP = [_currentUser objectForKey:CFBridgingRelease(kSecValueData)];
    
    AuthController *auth = [AuthController sharedInstance];
    
    
    //save username and password in keychain
    
    
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


- (void) login:(CDVInvokedUrlCommand *)cmd
{
    command = cmd;
    AuthController *auth = [AuthController sharedInstance];
    [auth initialize];
    _currentUser = [[KeychainItemWrapper alloc] initWithIdentifier:@"Login" accessGroup:nil];
    [_currentUser resetKeychainItem];
    auth.delegate = self;
    auth._userName = [command.arguments objectAtIndex:0];
    auth._passWord = [command.arguments objectAtIndex:1];
    [_currentUser setObject:[command.arguments objectAtIndex:0] forKey:(id)(kSecAttrAccount)];
    [auth authenticate];
}



- (void)authenticationError:(NSString*)errorTitle andDescription:(NSString*)errorDescription
{
    // Create an object with a simple success property.Return false
    CDVPluginResult *pluginResult = [ CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorDescription];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}

@end
