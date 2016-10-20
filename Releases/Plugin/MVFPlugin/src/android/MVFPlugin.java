package cisco.plugin.mvf;

import com.dft.cisco.vaf.framework.MandatoryUpdateService;
import com.dft.cisco.vaf.framework.VAFCiscoLife;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;


public class MVFPlugin extends CordovaPlugin {
    
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }
    
    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        MandatoryUpdateService mandatoryUpdateService= MandatoryUpdateService.getInstance(cordova.getActivity(), new MandatoryUpdateService.OnMandatoryUpdateCompletedListener() {
            @Override
            public void onMandatoryUpdateCompleted() {
                callbackContext.success("Update Complete");
            }
        });
        mandatoryUpdateService.check(VAFCiscoLife.PROD);
        boolean response= mandatoryUpdateService.parseJsonResponse();
        
        return true;
    }
}
