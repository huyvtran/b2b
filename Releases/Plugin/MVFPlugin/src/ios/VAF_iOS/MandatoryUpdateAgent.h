//
//  MandatoryUpdateAgent.m
//  mVAF_Sample
//
//  Created by rnallave on 8/19/13.
//  Copyright (c) 2013 Cisco Systems Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#define ALLOW_USER_TO_USE_APP @"AllowUserToUseApp"
#define UPDATE_AVAILABLE @"UpdateAvaiable"
typedef enum
{
    DEV, STAGE, PROD
} Environment;
@interface MandatoryUpdateAgent : NSObject< NSURLConnectionDelegate,NSURLConnectionDataDelegate >{
}
- (void)mandatoryUpdateCheck:(Environment)ciscoLifeFlag andTimeOutInterval:(NSTimeInterval)timeOutInterval;
- (void)mandatoryUpdateCheck; //Use this method only if you wanna Call Prod by default.

@end
