import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {NavController, NavParams, ActionSheet, Platform} from 'ionic-angular';
import {PieChart} from '../../components/pie-chart/pie-chart';
import {BarChart} from '../../components/bar-chart/bar-chart';
import {MultiSeriesChart} from '../../components/multi-series-chart/multi-series-chart';
import {SummaryDetail} from '../../components/summary-detail/summary-detail';
import {CollapsiblePane} from '../../components/collapsible-pane/collapsible-pane';
import {SwitchViewContainer} from '../../components/switch-view/switch-view';
import {CapListView} from '../../components/cap-list-view/cap-list-view';
import {B2BService} from '../../providers/b2b-service/b2b-service';


@Component({
  templateUrl: 'build/pages/item-details/preference-details.html',
  directives: [PieChart, CORE_DIRECTIVES, SummaryDetail,CollapsiblePane,SwitchViewContainer,CapListView, BarChart, MultiSeriesChart]
})
export class PreferenceDetail {
  selectedItem: any;
  pageTitle: any;
  capList = [];
  trendsList = [];
  constructor(private navCtrl: NavController, navParams: NavParams, private b2bService:B2BService, private platform:Platform) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.pageTitle = navParams.get('title');
    
    //this.b2bService.loadTrends().then(res=>{
    //  this.trendsList = res['trendDetails'];
   // })  

    this.b2bService.loadCapList(this.selectedItem.name, this.selectedItem.subCategories[0].name).then(res=>{
        this.capList = res.subCategoryDetails;
        this.trendsList = res.trendDetails;
    })


  }

  headerTappedHandler(event){
        let actionSheet = ActionSheet.create({
          cssClass: 'action-sheets-basic-page',
          buttons: [
            {
              text: 'CALLS',
              handler: () => {
                this.navigateToPage('CALLS');
              }
            },
            {
              text: 'CAPS',
              handler: () => {
                this.navigateToPage('CAPS');
              }
            },
            {
              text: 'CASES',
              handler: () => {
                this.navigateToPage('CASES');
              }
            },
            {
              text: 'DEFICIENCIES',
              handler: () => {
                this.navigateToPage('DEFICIENCIES');
              }
            },
            {
              text: 'FAILURE',
              handler: () => {
                this.navigateToPage('FAILURE');
              }
            },
            {
              text: 'Cancel',
              role: 'cancel', // will always sort to be on the bottom
              icon: !this.platform.is('ios') ? 'close' : null,
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
      });

      this.navCtrl.present(actionSheet);
  }

  selectionChangedHandler(data){
    this.b2bService.loadCapList(this.selectedItem.name, this.selectedItem.subCategories[data.value].name).then(res=>{
        this.capList = res.subCategoryDetails;
        this.trendsList = res.trendDetails;
    })
  }

  navigateToPage(page){
    let p =  this.b2bService.getSelectedPlatform();
    p = p.categories.filter((cat)=>{
      return cat.name.toUpperCase() == page;
    });
    if(!!p.length){
      this.navCtrl.push(PreferenceDetail,{item:p[0]}).then(rs=>{
        this.navCtrl.remove(1);
      });
    }
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
  // --------------------------


}
