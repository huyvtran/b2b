import { Component } from '@angular/core';
import { NavController, NavParams, Nav, Alert, Loading } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth-service/auth-service';
import { MenuController, Events } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  credentials: Object = {};
  rememberMe: boolean = true;

  constructor(private navCtrl: NavController, private authService: AuthService, private menuCtrl: MenuController, private events: Events) {
    // If we navigated to this page, we will have an item available as a nav param
    this.credentials = {};
    this.menuCtrl.swipeEnable(false);
  }

  itemTapped(event, item) {
    this.authenticate();
  }

  authenticate() {
    let loading = Loading.create({
      content: 'Logging in...',
      dismissOnPageChange: true
    });
    this.navCtrl.present(loading);
    this.authService.authenticate(this.credentials, this.rememberMe).then(data => {
      loading.onDismiss(() => {
        var self = this;
        setTimeout(()=> {
          self.events.publish('user:authed');
        }, 50);
      });
      loading.dismiss();
    }, err => {
      loading.dismiss();
	    var loginErrorMessage = err.error_description;
      if(loginErrorMessage && loginErrorMessage.indexOf('fail to process username & password') != -1) {
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
}
