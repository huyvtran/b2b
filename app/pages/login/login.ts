import { Component } from '@angular/core';
import { NavController, MenuController, Events, Alert } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth-service/auth-service';

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
    this.events.publish('user:logging_in');
    this.authService.authenticate(this.credentials, this.rememberMe).then(data => {
      this.events.publish('user:login_success');
    }, err => {
      this.events.publish('user:login_failed');
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
