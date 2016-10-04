//
//  TouchIDPlugin.h
//  BackToBasics
//
//  Created by NCR_MAC on 9/27/16.
//
//
#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import "AuthController.h"
#import "TouchIDManager.h"
#import "KeychainItemWrapper.h"



@interface TouchIDPlugin : CDVPlugin <CallBackDelegate, TouchIDSetUpDelegate,TouchIDValidaterDelegate,UITextFieldDelegate,UIAlertViewDelegate>
{
    
    AuthController* authController;
    UIActivityIndicatorView *spinner;
}



- (void) touchIDAuthentication:(CDVInvokedUrlCommand *)command;

@property(nonatomic) NSString *saveUserName;
@property(nonatomic) NSString *savePassword;
@property (weak, nonatomic) IBOutlet UITextField *userNameTf;
@property (weak, nonatomic) IBOutlet UITextField *passwordTf;
@property (weak, nonatomic) IBOutlet UISwitch *rememberMeSwitch;
@property (weak, nonatomic) IBOutlet UIButton *signInButton;
@property (nonatomic,retain) TouchIDManager *touchIDManager;
@property (nonatomic,retain)  KeychainItemWrapper *currentUser;

@end
