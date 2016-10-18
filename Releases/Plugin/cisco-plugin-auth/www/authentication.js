var Authentication = {};

Authentication.touchIDAuthentication = function(credentials, successCallback, errorCallback) {
    cordova.exec(
      successCallback, errorCallback,
      "Authentication", "touchIDAuthentication", [credentials.username, credentials.password]);
},

Authentication.loginWithTouchID = function(credentials, successCallback, errorCallback) {
    cordova.exec(
      successCallback, errorCallback,
      "Authentication", "loginWithTouchID", [credentials.username, credentials.password]);
},

Authentication.enableTouchIDOption = function(successCallback, errorCallback) {
    cordova.exec(
      successCallback, errorCallback,
      "Authentication", "enableTouchIDOption");
    },

    Authentication.login = function(credentials, successCallback, errorCallback) {
    cordova.exec(
      successCallback, errorCallback,
      "Authentication", "login", [credentials.username, credentials.password]);
};
module.exports = Authentication;
