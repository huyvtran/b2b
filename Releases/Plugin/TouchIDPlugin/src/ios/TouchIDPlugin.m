//
//  TouchIDPlugin.m
//  BackToBasics
//
//  Created by NCR_MAC on 9/27/16.
//
//

#import "TouchIDPlugin.h"

@interface TouchIDPlugin ()
{
    
    CDVInvokedUrlCommand * command;
}

@end

@implementation TouchIDPlugin

// To login the app using username and password.
-(void)touchIDAuthentication :(CDVInvokedUrlCommand *)cmd

{
    command = cmd;
    AuthController *auth = [AuthController sharedInstance];
    [auth initialize];
    _currentUser = [[KeychainItemWrapper alloc] initWithIdentifier:@"Login" accessGroup:nil];
    [_currentUser resetKeychainItem];
    auth.delegate = self;
    auth._userName = [command.arguments objectAtIndex:0];
    auth._passWord = [command.arguments objectAtIndex:1];
    _saveUserName= [command.arguments objectAtIndex:0];
    _savePassword = [command.arguments objectAtIndex:1];
    // [currentUser setObject:[command.arguments objectAtIndex:0] forKey:(id)(kSecAttrAccount)];
    [auth authenticate];
    
    
    
    
   
    

}

//To login the app using touch id functionality.

-(void)loginWithTouchID :(CDVInvokedUrlCommand *)cmd
{
    
    command = cmd;
    AuthController *auth = [AuthController sharedInstance];
    [auth initialize];
    _currentUser = [[KeychainItemWrapper alloc] initWithIdentifier:@"Login" accessGroup:nil];
    // [currentUser resetKeychainItem];
    
    if ([_currentUser objectForKey:CFBridgingRelease(kSecAttrAccount)] && [_currentUser objectForKey:CFBridgingRelease(kSecValueData)])
    {
        
        _touchIDManager = [[TouchIDManager alloc]init];
        _touchIDManager.delegate = self;
        if ([_touchIDManager canEvaluatePolicyMtd])
        {
            [_touchIDManager checkAndEvaluateTouchID];
        }
        else
        {
            // Return false
            UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"Alert!" message:@"Touch ID is not enabled" preferredStyle:UIAlertControllerStyleAlert];
            
            UIAlertAction* ok = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil];
            [alertController addAction:ok];
            
            // [self presentViewController:alertController animated:YES completion:nil];
            
            
            /* [currentUser setObject:@"" forKey:CFBridgingRelease(kSecAttrAccount)];
             [currentUser setObject:@"" forKey:CFBridgingRelease(kSecValueData)];
             UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"Alert!" message:@"Please sign in " preferredStyle:UIAlertControllerStyleAlert];
             
             UIAlertAction* ok = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil];
             [alertController addAction:ok];
             
             [self presentViewController:alertController animated:YES completion:nil];*/
            
            
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
    
    /* if([_userNameTf.text isEqualToString:@"sandeep9"] && [_passwordTf.text isEqualToString:@"Aug_2016"]){
     
     authController._userName = _userNameTf.text;
     authController._passWord = _passwordTf.text;
     
     [authController authenticate];
     
     
     [NSThread detachNewThreadSelector:@selector(waitingForAuthentication:) toTarget:self withObject:nil];
     
     
     }
     else
     {
     UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"Alert!" message:@"Invalid Username or Password" preferredStyle:UIAlertControllerStyleAlert];
     
     UIAlertAction* ok = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil];
     [alertController addAction:ok];
     
     [self presentViewController:alertController animated:YES completion:nil];
     
     }*/
    
    
    
    
    
}

-(void)logoutAndResetApplication
{
    //Return false
    [_currentUser setObject:@"" forKey:CFBridgingRelease(kSecAttrAccount)];
    [_currentUser setObject:@"" forKey:CFBridgingRelease(kSecValueData)];
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"Alert!" message:@"Please sign in " preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* ok = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil];
    [alertController addAction:ok];
    
    //[self presentViewController:alertController animated:YES completion:nil];
    
    
    CDVPluginResult *pluginResult = [ CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"please sign in"];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}


- (void)authorized
{
    //Return true
    
    AuthController *auth = [AuthController sharedInstance];
    
    _rememberMeSwitch.on? [_currentUser setObject:_saveUserName forKey:CFBridgingRelease(kSecAttrAccount)]: [_currentUser resetKeychainItem];
    _rememberMeSwitch.on? [_currentUser setObject:_savePassword forKey:CFBridgingRelease(kSecValueData)]: [_currentUser resetKeychainItem];
    
    
    
    // [NSThread detachNewThreadSelector:@selector(waitingForAuthentication:) toTarget:self withObject:nil];
    
    
    
    
    
    
    
    
    
    
    
    
    
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
    // Create an object with a simple success property.Return false
    CDVPluginResult *pluginResult = [ CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorDescription];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}










@end
