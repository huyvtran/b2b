//
//  TouchIDManager.h
//  Seed App
//
//  Created by Hema Malini on 25/11/15.
//  Copyright © 2015 Cisco Systems Inc. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <LocalAuthentication/LocalAuthentication.h>

/**
 * Will be called when Touch ID authentication mechanism is approved/rejected based on user confirmation
 Mandatory to use in App Delegate of seed app and Login View Controller incase of ROC grant type.
 */

@protocol TouchIDSetUpDelegate

- (void) touchIDSetUpSuccessful;

@end

/**
 * Will be called when Touch ID authentication was successful, re-directed to Passcode in case of touchid cancel/incorrect and to logout in case of too many attempts and no fallback
 To be used in AppDelegate.m to validate touchID during app switching.
 */

@protocol TouchIDValidaterDelegate

-(void) touchIDSuccessCallBack;   //Touch ID authentication is successful, add logic to show app content
-(void) showPasscodeAsFallBack;  //Show passcode authentication as backup for touchID failure
-(void)logoutAndResetApplication; //to logout and reset all the values

@end

@interface TouchIDManager : UIViewController<UIAlertViewDelegate>

@property(assign) id <TouchIDSetUpDelegate, TouchIDValidaterDelegate> delegate;


/**
 * To be called to evaluate if the target is simulator or device that doesnt support touch ID, required to setup TouchID
 */

-(BOOL)canEvaluatePolicyMtd;

/**
 * To be called to check touch ID support and evaluation to authenticate the User
 */

-(void)checkAndEvaluateTouchID;

/**
 * To be called when both touch ID and Passcode authentication mechanism are used in the App
 */

-(void)touchIDAuthenticationWithPasscode;


@end
