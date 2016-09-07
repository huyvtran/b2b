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
  oldCategories:any = null;
  loading:any = null;

  //preference = [{label:'CAPS',value:true},{label:'Cases',value:true},{label:'Defects',value:false},{label:'Deficiencies',value:true},{label:'Customer Pain',value:true},{label:'Hardware Returns',value:true}];
  constructor(
    private platform: Platform,
    private menu: MenuController,
    public b2bService: B2BService,
    public events: Events,
    private authService:AuthService,
    private netService:NetworkService    
  ) {
    this.initializeApp();    

    this.events.subscribe('user:authed', () => {
      // arg is an array of parameters, so grab our first and only arg
      this.loadData();
    });
  }

  ngOnInit() {
    this.loading = Loading.create({
      content: "Checking certificate's security..."
    });
    this.nav.present(this.loading);

    this.checkConn();
  }

  checkConn() {
    this.netService.checkConnection().then(res => {
      //this.checkAuth();
      this.checkCertPinning();
    }, err => {
      this.loading.dismiss();
      this.showAlert(err.error_description);
    });
  }

  checkAuth() {
    if(this.authService.isAuthenticated()) {
      this.loading.data.content = 'Loading data...';
      var self = this;
      setTimeout(()=> {
        self.loadData();
      }, 50);      
    } else {
      this.loading.dismiss();
      this.rootPage = LoginPage;
    }
  }

  loadData() {
    // set our menu list
    this.b2bService.load().then(respone => {
      this.plateforms = respone.products;
      this.activePlateform = this.plateforms[0];
      this.preferencesModel(this.activePlateform);
      this.activePlateform['info'] = respone.info || "";
      this.b2bService.setSelectedPlatform(this.activePlateform);
      this.info = respone.info || "";
      this.gotoHomePage();
      if(this.loading) this.loading.dismiss();
    });
  }

  gotoHomePage() {
    this.nav.setRoot(HomePage, { page: this.b2bService.getSelectedPlatform(),info:this.info });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
	    StatusBar.styleDefault();
    });
  }

  checkCertPinning() {
    this.platform.ready().then(() => {
      if(!window['plugins']['sslCertificateChecker']) {
        this.checkAuth();
        return;
      }

      var server = "https://cloudsso.cisco.com";
      var fingerprint = "5a ae a8 21 4a 91 ad f7 63 40 c9 4b 39 54 86 3e 73 6f 39 fa";
      var self = this;
      window['plugins']['sslCertificateChecker'].check(
            function(message) {
              self.checkAuth();
            },
            function(message) {
              this.loading.dismiss();
              this.showAlert("Certificate mismatched ! Please kill the application and start again.");
            },
            server,
            fingerprint);
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
  ** Displaying a toast message on the screen
  @params message: message which needs to be displayed
          position: position on screen , center, bottom. 
  */
  showToast(message, position) {
    Toast.show(message, "short", position).subscribe(
      toast => {
      }
    );
  }
  /*
  ** Open any Page baed on the click performed.
  */
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    
    this.oldCategories = {};
    var self = this;
    this.activePlateform.categories.forEach(function(item) {
      self.oldCategories[item.name] = item.value;
    });
    this.activePlateform = page;
    this.preferencesModel(this.activePlateform);
    this.b2bService.setSelectedPlatform(page);
    this.nav.setRoot(HomePage, { page, info: this.info });
  }

  preferencesModel(page) {
    var self = this;
    page.categories.forEach(function(item) {
      item.value = (self.oldCategories && self.oldCategories.hasOwnProperty(item.name)) ? self.oldCategories[item.name] : true;
    });
  }

  /*
  ** for removing SP and SP-
  */
  correctName(label){
    if(label.startsWith("SP ")){
      var i = 3;
      if (label.startsWith("SP -")) {
        i = 5;
      }
      return label.substring(i, label.length);
    }
    return label;
  }

  /*
  ** Go to login Page
  */
  logout() {
    this.oldCategories = null;
    this.authService.logout();
    this.menu.close();
    this.nav.push(LoginPage);
  }

  /*
  ** Exit Application
  */
  exitApp() {
    this.platform.exitApp();
  }

  /*
  ** Go to Help Page
  */
  openHelpPage() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.nav.push(HelpPage);
  }

}

ionicBootstrap(Back2Basic, [B2BService, AuthService, NetworkService]);
