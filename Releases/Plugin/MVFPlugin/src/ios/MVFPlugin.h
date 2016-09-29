//
//  MVFPlugin.h
//  BackToBasics
//
//  Created by NCR_MAC on 9/27/16.
//
//

#import <Cordova/CDV.h>
#import "MandatoryUpdateAgent.h"


@interface MVFPlugin : CDVPlugin
{
    MandatoryUpdateAgent *updateAgent;
    UIActivityIndicatorView *spinner;
}

- (void) mandatoryCheck:(CDVInvokedUrlCommand *)command;


@end
