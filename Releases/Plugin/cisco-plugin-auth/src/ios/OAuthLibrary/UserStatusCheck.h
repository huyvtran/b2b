//
//  UserStatusCheck.h
//  OAuthLibrary
//
//  Created by rnallave on 2/9/15.
//  Copyright (c) 2015 Cisco Sytems Inc. All rights reserved.
//

@protocol UserStatusChangeDelegate <NSObject>;
- (void)userStatusCallBack;
@end

#import <Foundation/Foundation.h>

@interface UserStatusCheck : NSObject <NSURLConnectionDelegate>
@property id <UserStatusChangeDelegate> delegate;

/**
 * A class level method, returns an instance of UserStatusCheck class.
 */
+ (UserStatusCheck *)sharedInstance;

/**
 * Validates and returns YES or NO based on the user status check configurable attribute.
 */
-(BOOL)userStatusCheckCallPreValidation;

/**
 * User Status check call is performed by taking access token as input parameter.
 */
-(void)userStatusCheckCall:(NSString*)accessToken andIsThisRightAfterUserLogin:(BOOL)failureWillLogoutUser;

/**
 * Clears out all the saved user status check API results, this method is typically called on logout.
 */
-(void)clearUserStatusAPIResults;
@end
