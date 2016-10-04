//
//  PasscodeUnlock.h
//  OAuthLibrary
//
//  Created by rnallave on 2/19/15.
//  Copyright (c) 2015 Cisco Sytems Inc. All rights reserved.
//

#import <UIKit/UIKit.h>
@protocol PasscodeValidaterDelegate
- (void)passcodeMatched;
-(void)forgotPasscode;
@end
@interface PasscodeUnlock : UIViewController <UITextFieldDelegate>
@property(assign) id <PasscodeValidaterDelegate> delegate;
@end
