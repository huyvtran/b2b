import {Component} from '@angular/core';
import {PreferenceDetail} from '../item-details/preference-details';
import {CasesDetails} from '../item-details/cases-details';
import {DefectDetails} from '../item-details/defect-details';
import {DeficienciesDetails} from '../item-details/deficiencies-details';
import {HardwareDetails} from '../item-details/hardware-return-details';
import {NavController, Loading, NavParams} from 'ionic-angular';
import {B2BService} from '../../providers/b2b-service/b2b-service';
import { MenuController } from 'ionic-angular';
import {Toast} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  cards = [];
  lastRefreshed = '';
  itemSelected = null;
  pageTitle: string;
  private product:any
  private pages = {
    "Cases":CasesDetails,
    "CAPS":PreferenceDetail,
    "Defects":DefectDetails,
    "Deficiencies": DeficienciesDetails,
    "Hardware Returns":HardwareDetails
  }

  constructor(private navCtrl: NavController, private b2bService: B2BService, private navParams: NavParams, private menuCtrl: MenuController) {
    this.product = this.navParams.get('page');
    this.pageTitle = this.product.name;
    this.menuCtrl.swipeEnable(true);
    /*let loading = Loading.create({
      content: 'Please wait...'
      });
      this.navCtrl.present(loading);
      loading.dismiss();
    */
    //b2bService.load().then(response => {
    //let product = response.products[activeIndex.ID-1];
    this.initializeItems();
    this.lastRefreshed = new Date().toLocaleString()    
  }



  itemTapped(event, item, index) {	  
    this.navCtrl.push(this.pages[item.name], {
      item: item,
	  index:index,
      title: this.pageTitle

    }).then(res => {
      this.itemSelected = null
    });
  }

  initializeItems(){
    this.cards = this.product.categories;    
  }

  getItems(ev: any) {
    this.initializeItems();
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.cards = this.cards.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  showToast(message, position) {
      Toast.show(message, "short", position).subscribe(
          toast => {
              console.log(toast);
          }
      );
  }
  correctName(label) {
    if (label.startsWith("SP ")) {
      var i = 3;
      if (label.startsWith("SP -")) {
        i = 5;
      }
      return label.substring(i, label.length);
    }
    return label;
  }
}
