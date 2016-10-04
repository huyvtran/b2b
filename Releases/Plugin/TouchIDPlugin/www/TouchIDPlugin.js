var TouchIDPlugin = {};

TouchIDPlugin.touchIDAuthentication = function(credentials, successCallback, errorCallback) {
    cordova.exec(
      successCallback, errorCallback,
      "TouchIDPlugin", "touchIDAuthentication", [credentials.username, credentials.password]);
},

TouchIDPlugin.loginWithTouchID = function(credentials, successCallback, errorCallback) {
    cordova.exec(
      successCallback, errorCallback,
      "TouchIDPlugin", "loginWithTouchID", [credentials.username, credentials.password]);
}
module.exports = TouchIDPlugin;