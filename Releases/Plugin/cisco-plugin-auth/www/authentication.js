var Authentication = {};
/**
 * Authenticate User - login
 * @param {Object} credentials - username, password.
 * @param {Function} successCallback The function to call when the data is available.
 * @param {Function} errorCallback The function to call when there is an error getting the data.
 */
Authentication.login = function(credentials, successCallback, errorCallback) {
    cordova.exec(
      successCallback, errorCallback,
      "Authentication", "login", [credentials.username, credentials.password]);
};

module.exports = Authentication;
