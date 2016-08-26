import {Component} from '@angular/core';
import {NavController, NavParams, Nav, Alert, Loading} from 'ionic-angular';
import {HomePage} from '../home/home';
import {B2BService} from '../../providers/b2b-service/b2b-service';
import {AuthService} from '../../providers/auth-service/auth-service';
import { MenuController, Events } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [AuthService]
})
export class LoginPage {
  credentials: Object = {};
  rememberMe: boolean = true;
  private info = "";
  constructor(private navCtrl: NavController, private authService:AuthService, private b2bService: B2BService, private menuCtrl: MenuController, public events: Events) {
    // If we navigated to this page, we will have an item available as a nav param
    this.credentials = {};
    this.menuCtrl.swipeEnable(false);
  }

  onPageWillEnter() {
  }

  itemTapped(event, item) {
    this.authenticate();
  }

  authenticate() {
    let loading = Loading.create({
      content: 'Logging in...'
    });
    this.navCtrl.present(loading);
    this.authService.authenticate(this.credentials, this.rememberMe).then(data => {
      loading.dismiss();
      this.events.publish('user:auth');
      //this.gotoHomePage();
    }, err => {
      loading.dismiss();
     var loginErrorMessage = err.error_description;
      if(err.error_description.indexOf('fail to process username & password') !=-1){
       loginErrorMessage = 'Username or Password is Invalid.';
      }

      let alert = Alert.create({
        title: '',
        message: loginErrorMessage,
        buttons: ['OK']
      });
      this.navCtrl.present(alert);
    });
  }

  gotoHomePage() {
    this.navCtrl.setRoot(HomePage, { page: this.b2bService.getSelectedPlatform(),info:this.b2bService.getSelectedPlatform()['info'] });
  }
}
