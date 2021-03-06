import {Component} from '@angular/core';
import {PreferenceDetail} from '../item-details/preference-details';
import {CasesDetails} from '../item-details/cases-details';
import {DefectDetails} from '../item-details/defect-details';
import {DeficienciesDetails} from '../item-details/deficiencies-details';
import {HardwareDetails} from '../item-details/hardware-return-details';
import {CustomerPainDetails} from '../item-details/customer-pain-details';
import {NavController, Loading, NavParams} from 'ionic-angular';
import {B2BService} from '../../providers/b2b-service/b2b-service';
import { MenuController, Events } from 'ionic-angular';
import {Toast} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  cards = [];
  lastRefreshed = '';
  itemSelected = null;
  pageTitle: string;
  enableSearch: boolean = false;
  public page: any;
  private pages = {
    "Cases": CasesDetails,
    "CAPS": PreferenceDetail,
    "Defects": DefectDetails,
    "Deficiencies": DeficienciesDetails,
    "Customer Pain": CustomerPainDetails,
    "Hardware Returns (RMA)": HardwareDetails
  }
  info = "";

  constructor(private navCtrl: NavController, private b2bService: B2BService, private navParams: NavParams, private menuCtrl: MenuController) {
    this.page = this.navParams.get('page');
    this.info = this.prepareInfoData(this.page, this.navParams.get('info')) || "No Info available";
    this.pageTitle = this.page.name;
    this.menuCtrl.swipeEnable(true);
    this.initializeItems();
    this.lastRefreshed = new Date().toLocaleString();
  }


  /**
  * handler for card click.
  * @item: object of card, which is tapped.
  * @index: index of card in list
  */
  itemTapped(event, item, index) {
    // Navigating to card detail page
    this.navCtrl.push(this.pages[item.name], {
      item: item,
      index: index,
      title: this.pageTitle

    }).then(res => {
      this.itemSelected = null
    });
  }

  /**
  * Added 'visible' property in card object, which is being used for filtering
  */
  initializeItems() {
    debugger
    this.page.categories.forEach(function(item) {
      item.visible = true;
    });
  }
  /*
  ** Filtering items based on the search input from the user.
  */
  /**
  * Card Filter based on preference selected
  */
  getItems(ev: any) {
    this.initializeItems();
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.page.categories.forEach(function(item) {
        item.visible = (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  showToast(message, position) {
    Toast.show(message, "short", position).subscribe(
      toast => {
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
  /*
  ** Clearing Search data
  */
  /**
  * Clear search
  */
  onCancel() {
    this.initializeItems();
    this.enableSearch = false;
  }

  /**
  * Preparing HTML string for info
  */
  debugger;
  prepareInfoData(data, _info) {
    let info = "";
    //BUG -the data is showing random behaviour on IOS so changing according to below one and its works fine.
    //var arr = "2010-03-15 10:30:00".split(/[- :]/),    //2016-08-27 22:20:46.0  -- actuall comming in data json
    var arr = data.lastRefreshDate.split(/[- :]/),
      date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    info += '<b>Last Refreshed: </b>' + (date).toLocaleString() + '</br></br>';
    //---------------------------------------
    //info += '<b>Last Refreshed: </b>'+(new Date(data.lastRefreshDate)).toLocaleString()+'</br></br>';
    if (data.aggregationDetails.length > 1) {
      info += '<b>Aggregated view for:</b><ol>';
      for (let i = 0; i < data.aggregationDetails.length; i++) {
        info += '<li>' + data.aggregationDetails[i] + '</li>';
      }
      info += '</ol></br>';
    }
    info += _info;
    return info;
  }
}
