import {Component} from '@angular/core';
import {NavController, NavParams, Nav} from 'ionic-angular';
import {HomePage} from '../home/home';
import {B2BService} from '../../providers/b2b-service/b2b-service';
import { MenuController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {    
  constructor(private navCtrl: NavController, private b2bService:B2BService, private menuCtrl: MenuController) {
    // If we navigated to this page, we will have an item available as a nav param
    //this.selectedItem = navParams.get('item');
    this.menuCtrl.swipeEnable(false);
  }
  itemTapped(event, item) {   	   	
   	this.navCtrl.setRoot(HomePage,{page:this.b2bService.getSelectedPlatform()});
  }
}
