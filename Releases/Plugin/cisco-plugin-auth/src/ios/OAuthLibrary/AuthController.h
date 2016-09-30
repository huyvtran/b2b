//
//  AuthController.h
//  HeaderDemo
//
//  Created by rnallave on 1/21/14.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "KeychainItemWrapper.h"
#import <LocalAuthentication/LocalAuthentication.h>
#import "TouchIDManager.h"
/**
 * Call back delegate, lets the client app to continue with application flow.
 * The client app must implement this delegate.
 */
@protocol CallBackDelegate <NSObject>;
- (void)authorized;
- (void)authenticationError:(NSString*)errorTitle andDescription:(NSString*)errorDescription;
- (void)userStatusChanged;
@end

@interface AuthController : UIViewController <UITextFieldDelegate, UIWebViewDelegate, NSURLConnectionDelegate> {
    
}
@property (nonatomic, retain) NSString *_userName;
@property (nonatomic, retain) NSString *_passWord;
@property (nonatomic, retain) NSString *_authenticationType;
@property (nonatomic, retain) NSString * _grantType;
@property (nonatomic, retain) NSString *_loginViewType;
@property id <CallBackDelegate> delegate;
@property (nonatomic, assign) BOOL _enableCookie;
@property (nonatomic, assign) double _customImplicitInactiveTimeSeconds;
@property (nonatomic, assign) BOOL _enableSingleSignOn;
@property (nonatomic, retain) NSString *_appBundleSeedId;
@property (nonatomic, assign) BOOL _enablePasscode;
@property (nonatomic, assign) BOOL _enableTouchID;
/**
 * A class level method, returns an instance of AuthController class.
 */
+ (AuthController*)sharedInstance;

/**
 * Initializes the library with client credentials.
 */
- (void)initialize;

/**
 * Fectches access token to make an API call. Refreshes access token using "refresh token" if it is expired.
 */
- (NSString *)getToken;

/**
 * Example method created to make API call on behalf of client app; Expects the app URL and content type as parameters and returns response string.
 */
- (NSString *)connectionFactoryResponseWithURL:(NSURL *)appUrl andContentType:(NSString *)contentType;

/**
 * Retrieves User Profile data (First Name, Last Name, Access Level, UserId and Email) based on the logged in user id.
 * Example of User Profile Dictionary object: { accessLevel = 4; givenName = RangaReddy; mail = "rnallave@cisco.com"; sn = Nallavelli; uid = rnallave; }
 * Access Level: 1 - Guest , 2 - Customer , 3 - Partner, 4 - Employee
 */
- (NSDictionary *)getUserProfile;

/**
 * Logs the user out of the application. Invalidates/resets the access token and refresh token in Keychain and redirects the user to login page.
 */
- (BOOL)logOut;

/**
 * Checks the authentication status of the application.
 * Called when the application is launched to determine the view to be rendered (Login View vs Dashboard View)
 */
- (BOOL)isSignedIn;

/**
 * Determines the authentication type and performs authentication based on the configuration settings.
 */
- (void)authenticate;

/**
 * Invokes secure token to cookie API to get new ObSSOCookie if cookie is expired.
 */
-(NSInteger)refreshCookie;

/**
 * Returns the cookie status.This is optional method, typically called to decide if there is need to call refresh cookie.
 */
-(BOOL)isCookieValid;

/**
 * All apps participating in Single-Sign-On (SSO) must call this method in the "applicationWillEnterForeground" method to refresh sign-in status when app switches from background to foreground.
 */
-(void)refreshSignInPage;

/**
 * Updates ObSSOCookie in the Keychain, or adds it if it doesn't exist.
 */
- (void)setUserCookie:(NSString *)cookie;

/**
 * Retreives the refresh token,
 */

-(NSString*)getRefreshToken;

@end
