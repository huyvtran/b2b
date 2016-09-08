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
  oldCategories:Object = null;
  loading:any = null;
  AUTH_TYPE: string = 'password'; // implicit, password

  constructor(
    private platform: Platform,
    private menu: MenuController,
    public b2bService: B2BService,
    public events: Events,
    private authService: AuthService,
    private netService: NetworkService
  ) {
    this.initializeApp();

    this.events.subscribe('user:authed', () => {
      // arg is an array of parameters, so grab our first and only arg
      this.loadData(true);
    });
  }

  ngOnInit() {
    this.showLoading("Checking certificate's security...");
    this.checkConn();
  }

  showLoading(msg) {
    if(this.loading == null) {
      this.loading = Loading.create({
        content: msg
      });
      this.nav.present(this.loading);
    } else {
      this.loading.data.content = msg;
    }
  }

  hideLoading() {
    if(this.loading) {
      this.loading.onDismiss(() => {
        this.loading = null;
      });
      this.loading.dismiss();
    }
  }

  checkConn() {
    this.netService.checkConnection().then(res => {
      this.checkCertPinning();
    }, err => {
      this.hideLoading();
      this.showAlert(err.error_description);
    });
  }

  checkCertPinning() {
    this.platform.ready().then(() => {
      if(!window['plugins'] || !window['plugins']['sslCertificateChecker']) {
        this.checkAuth();
        return;
      }

      var server = "https://cloudsso.cisco.com";
      var fingerprint = "5a ae a8 21 4a 91 ad f7 63 40 c9 4b 39 54 86 3e 73 6f 39 fa";
      var self = this;
      window['plugins']['sslCertificateChecker'].check(
            function(msg) {
              self.checkAuth();
            },
            function(msg) {
              self.hideLoading();
              self.showAlert("SSL certificate mismatched ! Please kill the application and start again.");
            },
            server,
            fingerprint);
    });
  }

  checkAuth() {
    if(this.authService.isAuthenticated()) {
      this.loading.data.content = 'Loading data...';
      var self = this;
      setTimeout(()=> {
        self.loadData(false);
      }, 50);
    } else {
      this.hideLoading();
      if(this.AUTH_TYPE == 'password') {
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
      this.plateforms = res.products;
      this.activePlateform = this.plateforms[0];
      this.preferencesModel(this.activePlateform);
      this.activePlateform['info'] = res.info || "";
      this.b2bService.setSelectedPlatform(this.activePlateform);
      this.info = res.info || "";
      this.loading.onDismiss(() => {
        this.gotoHomePage();
        this.loading = null;
      });
      var self = this;
      setTimeout(()=> {
        if(self.loading) self.loading.dismiss();
      }, 100);
    }, err => {
      this.hideLoading();
      if(isByLogin) this.showAlert('Data load failed !, Please try again.');
      this.authService.logout();
      this.rootPage = LoginPage;
    });
  }

  gotoHomePage() {
    this.nav.setRoot(HomePage, { page: this.b2bService.getSelectedPlatform(), info: this.info });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
	    StatusBar.styleDefault();
    });
  }

  showAlert(msg) {
    let alert = Alert.create({
        title: '',
        message: msg,
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
               this.exitApp();
            }
          }
        ]
      });
    this.nav.present(alert);
  }

  /*
   * Displaying a toast message on the screen.
   */
  showToast(message, position) {
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
    if(this.AUTH_TYPE == 'password') {
      this.nav.push(LoginPage);
    } else {
      this.nav.push(LandingPage);
      this.implicitLogin();
    }
  }

  /*
   * Exit Application.
   */
  exitApp() {
    this.platform.exitApp();
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
    this.platform.ready().then(() => {
        this.ciscoLogin().then(res => {
            this.authService.implicitLogin(res);
            this.loadData(false);
        }, (err) => {
            this.showAlert(err);
        });
    });
  }

  public ciscoLogin(): Promise<any> {
      return new Promise(function(resolve, reject) {
          var browserRef = window.cordova.InAppBrowser.open("https://cloudsso.cisco.com/as/authorization.oauth2?response_type=token&client_id=d5sqnwvbe329pxbgwm68ncr2&redirect_uri=http://localhost/callback", "_self", "location=no,clearsessioncache=yes,clearcache=yes");
          browserRef.addEventListener("loadstart", (event) => {
              if ((event.url).indexOf("http://localhost/callback") === 0) {
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
          browserRef.addEventListener("exit", function(event) {
              reject("The Cisco sign in flow was canceled");
          });
      });
  }

}

ionicBootstrap(Back2Basic, [B2BService, AuthService, NetworkService]);
