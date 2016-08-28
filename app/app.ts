import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav, Events } from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoginPage} from './pages/login/login';
import {B2BService} from './providers/b2b-service/b2b-service';
import {AuthService} from './providers/auth-service/auth-service';
import {HomePage} from './pages/home/home';
import {HelpPage} from './pages/help/help';
import {CollapsiblePane} from './components/collapsible-pane/collapsible-pane';
import {Toast} from 'ionic-native';
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
  rootPage: any = LoginPage;
  plateforms: Array<{ title: string }>;
  private info = ""


  //preference = [{label:'CAPS',value:true},{label:'Cases',value:true},{label:'Defects',value:false},{label:'Deficiencies',value:true},{label:'Customer Pain',value:true},{label:'Hardware Returns',value:true}];
  constructor(
    private platform: Platform,
    private menu: MenuController,
    public b2bService: B2BService,
    public events: Events,
    private authService:AuthService
  ) {
    this.initializeApp();

    if(this.authService.getAuthorization()) {
      this.loadData();
    }

    this.events.subscribe('user:auth', (userEventData) => {
      // userEventData is an array of parameters, so grab our first and only arg
      this.loadData();
    });
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
  showToast(message, position) {
    Toast.show(message, "short", position).subscribe(
      toast => {
        console.log(toast);
      }
    );
  }
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.activePlateform = page;
    this.preferencesModel(this.activePlateform);
    this.b2bService.setSelectedPlatform(page);
    this.nav.setRoot(HomePage, { page, info: this.info });
  }


  preferencesModel(page) {
    page.categories.forEach(function(item) {
      item.value = true;
    })
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

  logout() {
    this.authService.logout();
    this.menu.close();
    this.nav.push(LoginPage);
    //this.platform.exitApp();
  }

  openHelpPage() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.nav.push(HelpPage);
  }

}

ionicBootstrap(Back2Basic, [B2BService, AuthService]);
