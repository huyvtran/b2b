//
//  MVFPlugin.m
//  BackToBasics
//
//  Created by NCR_MAC on 9/27/16.
//
//

#import "MVFPlugin.h"

@interface MVFPlugin ()
{
    CDVInvokedUrlCommand * command;
}

@end

@implementation MVFPlugin

-(void)stopSpinner:(id)sender

{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UPDATE_AVAILABLE object:nil];
    [spinner stopAnimating];
}
-(void)allowUserToUseApp
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:ALLOW_USER_TO_USE_APP object:nil];
    [spinner stopAnimating];
    /*  This is the case for no Mandatory Update.Do the next steps, like re loading views, presenting other view contollers like Login View Controllers or Dashboard Controllers */
    //if using below example code, please make sure you add DashBoardViewController to your project
    /*
     DashBoardViewController *runApp = [[DashBoardViewController alloc] init];
     [self presentViewController:runApp animated:YES completion:nil]; */
}
-(void)mandatoryCheck :(CDVInvokedUrlCommand *)cmd

{
    //MVF
    
    command =cmd;
    spinner =[[UIActivityIndicatorView alloc]initWithFrame:CGRectMake(145, 360, 30, 30)];
    [spinner setActivityIndicatorViewStyle:UIActivityIndicatorViewStyleWhiteLarge];
    spinner.color = [UIColor whiteColor];
    UIView* parentView = self.viewController.view;
    [parentView addSubview:spinner];
    
    /* Use Cisco Life Flag = DEV (or) STAGE (or) PROD accordingly.
     Custom TimeoutInterval is provided for testing purpose on all states of Network  */
    updateAgent = [[MandatoryUpdateAgent alloc] init];
    [updateAgent mandatoryUpdateCheck:DEV andTimeOutInterval:5];
    [spinner startAnimating];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(stopSpinner:)
                                                 name:@"UpdateAvailable"
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(allowUserToUseApp)
                                                 name:@"AllowUserToUseApp"
                                               object:nil];
    NSString *testString = @"MVF Functions executed successfully";
//    NSData *data=[testString dataUsingEncoding:NSUTF8StringEncoding];
//    NSDictionary *dict = [NSPropertyListSerialization propertyListWithData:data  options:kNilOptions format:NULL error:NULL];
//    CDVPluginResult *pluginResult = [ CDVPluginResult resultWithStatus    : CDVCommandStatus_OK messageAsDictionary : dict];
    CDVPluginResult* pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:testString];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}









@end
