//
//  ChangePasscodeHandler.h
//  OAuthLibrary
//
//  Created by rnallave on 2/20/15.
//  Copyright (c) 2015 Cisco Sytems Inc. All rights reserved.
//

#import <UIKit/UIKit.h>
@protocol ChangePasscodeDelegate
- (void)passcodeChangeSuccessful;
- (void)forgotCurrentPasscode;
@end
@interface ChangePasscodeHandler : UIViewController <UITextFieldDelegate>
@property(assign) id <ChangePasscodeDelegate> delegate;
@end
