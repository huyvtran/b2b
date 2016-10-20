//
//  PasscodeManager.h
//  OAuthLibrary
//
//  Created by rnallave on 2/12/15.
//  Copyright (c) 2015 Cisco Sytems Inc. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol PasscodeSetUpDelegate
- (void)passcodeSetUpSuccessful;
@end
@interface PasscodeManager : UIViewController <UITextFieldDelegate>
@property(assign) id <PasscodeSetUpDelegate> delegate;
/**
 * A boolean method which returns YES or NO based on the passcode existence, which is quite useful to handle client app passcode logic in the termination scenario.
 */
-(BOOL)doesExistsPasscode;
@end
