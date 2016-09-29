
var exec = require('cordova/exec');

exports.mandatoryCheck = function(arg0, success, error) {
  exec(success, error, "MVFPlugin", "mandatoryCheck", [arg0]);
};

