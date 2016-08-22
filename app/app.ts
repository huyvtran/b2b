import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoginPage} from './pages/login/login';
import {B2BService} from './providers/b2b-service/b2b-service';
import {HomePage} from './pages/home/home';
import {CollapsiblePane} from './components/collapsible-pane/collapsible-pane';

@Component({
  templateUrl: 'build/app.html',
  directives:[CollapsiblePane]
})
class Back2Basic {
  @ViewChild(Nav) nav: Nav;

  activePlateform:any;
  rootPage: any = LoginPage;
  plateforms: Array<{title: string}>;

  //preference = ['SP Quality Insights','MITG Communications','Mobility Business Group','NFV BU products','GSP Sales','Service Provider Video Software','Sale Connect','SE VT Show and Share'];
  preference = ['CAPS','Cases','Defects ','Deficiencies','Customer Pain','Hardware Deficiencies'];

  constructor(
    private platform: Platform,
    private menu: MenuController,
    public b2bService:B2BService
  ) {
    this.initializeApp();

    // set our menu list
    this.b2bService.load().then(respone=>{
      this.plateforms= respone.products;
      this.activePlateform = this.plateforms[0];
      this.b2bService.setSelectedPlatform(this.activePlateform);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });

  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.b2bService.setSelectedPlatform(page);
    // navigate to the new page if it is not the current page
    this.nav.setRoot(HomePage,{page});
  }
  //for removing SP and SP-
  correctName(label){
    if(label.startsWith("SP ")){
      var i = 3;
      if(label.startsWith("SP -")){
        i = 5;
      }
      return label.substring(i, label.length);
    }
    return label;
  }

}

ionicBootstrap(Back2Basic, [B2BService]);
