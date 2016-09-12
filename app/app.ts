import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav, Events, Loading, Alert} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoginPage} from './pages/login/login';
import {B2BService} from './providers/b2b-service/b2b-service';
import {AuthService} from './providers/auth-service/auth-service';
import {NetworkService} from './providers/network-service';
import {HomePage} from './pages/home/home';
import {LandingPage} from './pages/landing/landing';
import {HelpPage} from './pages/help/help';
import {CollapsiblePane} from './components/collapsible-pane/collapsible-pane';
import {Toast} from 'ionic-native';
import {enableProdMode} from '@angular/core';
enableProdMode();
declare var window: any;

@Component({
  templateUrl: 'build/app.html',
  directives: [CollapsiblePane]
})
class Back2Basic {
  @ViewChild(Nav) nav: Nav;

  activePlateform: any = {
    categories: []
  };
  rootPage: any = LandingPage;
  plateforms: Array<{ title: string }>;
  private info = "";
  oldCategories: Object = null;
  loading:any = null;
  AUTH_TYPE: string = 'browserLogin'; // browserLogin, customLogin
  isAlertPresent: boolean = false;
  UNAUTHORIZED: number = 401;

  constructor(
    private platform: Platform,
    private menu: MenuController,
    public b2bService: B2BService,
    public events: Events,
    private authService: AuthService,
    private netService: NetworkService
  ) {
    this.initializeApp();
    this.addEvents();    
  }

  addEvents() {
    this.events.subscribe('user:logging_in', () => {
      this.showLoading("Logging in...");
    });
    this.events.subscribe('user:login_success', () => {
      // arg is an array of parameters, so grab our first and only arg
      this.loadData(true);
    });
    this.events.subscribe('user:login_failed', () => {
      this.hideLoading();
    });
    this.events.subscribe('data:load_error', (arg) => {
      if(arg && arg[0] && arg[0].status == this.UNAUTHORIZED) {
        this.showAlert("Authorization required/Session expired ! Please login again.", arg[0].status);
      } else {
        //this.showAlert("Error while loading data !", -1);
      }
    });
  }

  ngOnInit() {
    this.checkConn();
  }

  showLoading(msg) {
    if(!this.loading) {
      this.loading = Loading.create({
        content: msg
      });
      this.nav.present(this.loading);
    } else {
      this.loading.data.content = msg;
    }
  }

  hideLoading() {
    try {
      if(!this.loading) return;
      this.loading.onDismiss(() => {
        this.loading = null;
      });
      this.loading.dismiss();
    } catch(e) {
      //console.log('Error: hideLoading');
    }
  }

  checkConn() {
    this.showLoading("Checking connection...");
    this.netService.checkConnection().then(res => {
      this.checkCertPinning();
    }, err => {
      this.hideLoading();
      this.showRetryAlert(err.error_description);
    });
  }

  checkCertPinning() {
    this.showLoading("Checking certificate's security...");
    this.platform.ready().then(() => {
      if(!window['plugins'] || !window['plugins']['sslCertificateChecker']) {
        this.checkAuth();
        return;
      }

      var server = "https://cloudsso.cisco.com";
      var fingerprint = "5a ae a8 21 4a 91 ad f7 63 40 c9 4b 39 54 86 3e 73 6f 39 fa";
      if(this.platform.is('ios')) {
        server = "https://wwwin-spb2b.cisco.com:8443";
        fingerprint = "51 F1 9D F2 81 B9 A8 0E F0 45 89 33 50 9B 02 C9 55 5D 2B F1";
      }
      var self = this;
      window['plugins']['sslCertificateChecker'].check(
            function(msg) {
              self.checkAuth();
            },
            function(msg) {
              self.hideLoading();
              self.showRetryAlert("SSL certificate mismatched ! Please kill the application and start again.");
            },
            server,
            fingerprint);
    });
  }

  checkAuth() {
    if(this.authService.isAuthenticated()) {
      this.loadData(false);
    } else {
      if(this.AUTH_TYPE == 'customLogin') {
        this.hideLoading();
        this.rootPage = LoginPage;
      } else {
        this.implicitLogin();
      }
    }
  }

  loadData(isByLogin) {
    this.showLoading('Loading data...');
    // set our menu list
    this.b2bService.load().then(res => {
      this.plateforms = res['products'];
      this.activePlateform = this.plateforms[0];
      this.preferencesModel(this.activePlateform);
      this.activePlateform['info'] = res['info'] || "";
      this.b2bService.setSelectedPlatform(this.activePlateform);
      this.info = res['info'] || "";
      this.gotoHomePage();
      setTimeout(()=> {
        this.hideLoading();
      }, 50);
    }, err => { 
      this.authService.logout();
      if(isByLogin) {
        this.hideLoading();
        this.showAlert('Error while loading data ! Please try again.', -1);
      } else {
        if(this.AUTH_TYPE == 'customLogin') {
          this.hideLoading();
          this.nav.setRoot(LoginPage);
        } else {
          this.nav.setRoot(LandingPage);
          this.implicitLogin();
        }
      }
    });
  }

  gotoHomePage() {
    this.nav.setRoot(HomePage, { page: this.b2bService.getSelectedPlatform(), info: this.info });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(window.cordova) {
        StatusBar.styleDefault();
      }
    });
  }

  showAlert(msg, statusCode) {
    if(this.isAlertPresent) return;
    this.isAlertPresent = true;

    let alert = Alert.create({
        title: '',
        message: msg,
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              this.isAlertPresent = false;
              if(statusCode == this.UNAUTHORIZED) {
                this.authService.logout();
                setTimeout(()=> {
                  this.checkAuth();
                }, 250);
              }
            }
          }
        ]
      });
    this.nav.present(alert);
  }

  showRetryAlert(msg) {
    if(this.isAlertPresent) return;
    this.isAlertPresent = true;

    var buttonsArr = [{
            text: 'Retry',
            role: 'cancel',
            handler: () => {
              this.isAlertPresent = false;
              this.checkConn();
            }
          }];
    if(!this.platform.is('ios')) {
      buttonsArr.push({
            text: 'Exit',
            role: 'cancel',
            handler: () => {
              this.exitApp();
            }
          });
    }
    let alert = Alert.create({
        title: '',
        message: msg,
        enableBackdropDismiss: false,
        buttons: buttonsArr
      });
    this.nav.present(alert);
  }

  /*
   * Displaying a toast message on the screen.
   */
  showToast(message, position) {
    if(!window.cordova) return;
    Toast.show(message, "short", position).subscribe(
      toast => {
      }
    );
  }

  /*
   * Open any Page baed on the click performed.
   */
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();

    this.oldCategories = {};
    var self = this;

    if(this.activePlateform && this.activePlateform.categories) {
      this.activePlateform.categories.forEach(function(item) {
        self.oldCategories[item.name] = item.value;
      });
    }
    this.activePlateform = page;
    this.preferencesModel(this.activePlateform);
    this.b2bService.setSelectedPlatform(page);
    this.nav.setRoot(HomePage, { page, info: this.info });
  }

  preferencesModel(page) {
    var self = this;
    if(page && page.categories) {
      page.categories.forEach(function(item) {
        item.value = (self.oldCategories && self.oldCategories.hasOwnProperty(item.name)) ? self.oldCategories[item.name] : true;
      });
    }
  }

  /*
   * for removing SP and SP-
   */
  correctName(label){
    if(label && label.startsWith("SP ")) {
      var i = 3;
      if (label.startsWith("SP -")) {
        i = 5;
      }
      return label.substring(i, label.length);
    }
    return label;
  }

  /*
   * Go to login Page.
   */
  logout() {
    this.oldCategories = null;
    this.authService.logout();
    this.menu.close();
    if(this.AUTH_TYPE == 'customLogin') {
      this.nav.setRoot(LoginPage);
    } else {
      this.nav.setRoot(LandingPage);
      this.implicitLogin();
    }
  }

  /*
   * Exit Application.
   */
  exitApp() {
    if(this.platform.is('android')) {
      this.platform.exitApp();
    }
  }

  /*
   * Go to Help Page.
   */
  openHelpPage() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.nav.push(HelpPage);
  }

  public implicitLogin() {
    this.showLoading("Loading...");
    this.platform.ready().then(() => {
        this.ciscoLogin().then(res => {
            this.authService.implicitLogin(res);
            this.loadData(false);
        }, (err) => {
            this.hideLoading();
            this.showRetryAlert(err);
        });
    });
  }

  public ciscoLogin(): Promise<any> {
      var pageTarget = "_self";
      var redirect_uri = "https://localhost/callback"; //https://localhost/callback, backtobasics://oauth2callback
      if(this.platform.is('ios')) pageTarget = "_blank";
      var self = this;
      return new Promise(function(resolve, reject) {
          var browserRef = window.cordova.InAppBrowser.open("https://cloudsso.cisco.com/as/authorization.oauth2?response_type=token&client_id=m6hgwkg3893tycmttefe7wsn&redirect_uri=" + redirect_uri, pageTarget, "location=no,clearsessioncache=yes,clearcache=yes");
          browserRef.addEventListener("loadstart", (event) => {
              if ((event.url).indexOf(redirect_uri) === 0) {
                  browserRef.removeEventListener("loadstop", (event) => {});
                  browserRef.removeEventListener("loaderror", (event) => {});
                  browserRef.removeEventListener("exit", (event) => {});
                  browserRef.close();
                  var responseParameters = ((event.url).split("#")[1]).split("&");
                  var parsedResponse = {};
                  for (var i = 0; i < responseParameters.length; i++) {
                      parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                  }
                  if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
                      resolve(parsedResponse);
                  } else {
                      reject("Problem authenticating with Cisco");
                  }
              }
          });
          browserRef.addEventListener("loadstop", function(event) {
            self.hideLoading();
            browserRef.removeEventListener("loadstop", (event) => {});
          });
          browserRef.addEventListener("loaderror", function(event) {
            //reject("Not able to load Cisco sign in page");
          });
          browserRef.addEventListener("exit", function(event) {
            reject("The Cisco sign in flow was canceled");
          });
      });
  }
}

ionicBootstrap(Back2Basic, [B2BService, AuthService, NetworkService]);
