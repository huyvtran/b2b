package com.cisco.authentication;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;

import com.cisco.dft.oauth.connections.AuthConnection;
import com.cisco.dft.oauth.entities.EntityAuth;
import com.cisco.dft.oauth.entities.EntityCredentials;
import com.cisco.dft.oauth.utils.AuthUtils;

public class Authentication extends CordovaPlugin {

    private final class JSONParameters {
        public static final String RESPONSE_ID = "responseId";
        public static final String COOKIE = "cookie";
        public static final String USERNAME = "username";
        public static final String ACCESS_TOKEN = "accessToken";
        public static final String REFRESH_TOKEN = "refreshToken";
        public static final String EXPIRES_IN = "expiresIn";
        public static final String EXPIRATION_TIME = "expirationTime";
        public static final String COOKIE_EXPIRES_IN = "cookieExpiresIn";
        public static final String ACCESS_LEVEL = "accesslevel";
        public static final String GRANT_TYPE = "granttype";
        public static final String LAST_USER_VALIDATION_TIME = "lastUserStatusValidationTime";
        public static final String ERROR = "error";
        public static final String ERROR_DESCRIPTION = "errorDescription";
    }

    /**
     * Constructor.
     */
    public Authentication() {
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        AuthUtils.initializelogintype(this.cordova.getActivity().getApplicationContext());
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if ("login".equals(action)) {
            this.login(args.getString(0),args.getString(1), callbackContext);
        }

        return true;
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param user              Username received from login screen.
     * @param pass              Password received from login screen.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     */
    private void login(String user, String pass, final CallbackContext callbackContext) {
        String userName = user;
        String password = pass;
        EntityCredentials credentials = new EntityCredentials();
        credentials.userName = userName;
        credentials.password = password;
        AuthConnection conn = new AuthConnection(this.cordova.getActivity().getApplicationContext());
        EntityAuth authResponse = conn.loginRoc(credentials.userName, credentials.password);
        JSONObject prepareResponseJson = new JSONObject();
        try {
            prepareResponseJson.put(JSONParameters.RESPONSE_ID, authResponse.responseId);
            prepareResponseJson.put(JSONParameters.COOKIE, authResponse.cookie);
            prepareResponseJson.put(JSONParameters.USERNAME, authResponse.username);
            prepareResponseJson.put(JSONParameters.ACCESS_TOKEN, authResponse.accessToken);
            prepareResponseJson.put(JSONParameters.REFRESH_TOKEN, authResponse.refreshToken);
            prepareResponseJson.put(JSONParameters.EXPIRES_IN, authResponse.expiresIn);
            prepareResponseJson.put(JSONParameters.EXPIRATION_TIME, authResponse.expirationTime);
            prepareResponseJson.put(JSONParameters.COOKIE_EXPIRES_IN, authResponse.cookieExpiresIn);
            prepareResponseJson.put(JSONParameters.ACCESS_LEVEL, authResponse.accesslevel);
            prepareResponseJson.put(JSONParameters.GRANT_TYPE, authResponse.granttype);
            prepareResponseJson.put(JSONParameters.LAST_USER_VALIDATION_TIME, authResponse.lastUserStatusValidationTime);
            prepareResponseJson.put(JSONParameters.ERROR, authResponse.error);
            prepareResponseJson.put(JSONParameters.ERROR_DESCRIPTION, authResponse.errorDescription);
            if(authResponse.responseId == 200){
				callbackContext.success(prepareResponseJson);
            } else {
                callbackContext.error(authResponse.errorDescription);
            }
        } catch (JSONException e) {
            callbackContext.error("Authentication failed");
        }
    }
}
