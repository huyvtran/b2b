import {Component} from '@angular/core';
import {PreferenceDetail} from '../item-details/preference-details';
/*import {CallDetails} from '../item-details/call-details';
import {BugDetails} from '../item-details/bug-details';*/
import {NavController, Loading, NavParams} from 'ionic-angular';
import {B2BService} from '../../providers/b2b-service/b2b-service';
import { MenuController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

	cards = [];
  lastRefreshed = ''; 
  itemSelected = null;
  pageTitle:string;   
  constructor(private navCtrl:NavController, private b2bService:B2BService, private navParams: NavParams, private menuCtrl: MenuController) {          
    let activeIndex = this.navParams.get('page');
    this.pageTitle = activeIndex.name;
    this.menuCtrl.swipeEnable(true);
    /*let loading = Loading.create({
        content: 'Please wait...'
      });
      this.navCtrl.present(loading);
      loading.dismiss();
    */
    b2bService.load().then(response => {      
      this.cards = response.platforms[activeIndex.id-1].categories;      
      this.lastRefreshed = new Date().toLocaleString()
    })
  }

  itemTapped(event, item) {
    this.navCtrl.push(PreferenceDetail,{
      item:item,
      title:this.pageTitle

    }).then(res=>{
      this.itemSelected = null
    });    
  }

  getItems(ev: any) {
    // Reset items back to all of the items

    // set val to the value of the searchbar
    let val = "ca";

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.cards = this.cards.filter((c) => {
        return (this.cards.indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  
}
