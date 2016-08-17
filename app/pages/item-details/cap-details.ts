import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {NavController, NavParams, ActionSheet, Platform} from 'ionic-angular';
import {PieChart} from '../../components/pie-chart/pie-chart';
import {BarChart} from '../../components/bar-chart/bar-chart';
import {SummaryDetail} from '../../components/summary-detail/summary-detail';
import {CollapsiblePane} from '../../components/collapsible-pane/collapsible-pane';
import {SwitchViewContainer} from '../../components/switch-view/switch-view';
import {CapListView} from '../../components/cap-list-view/cap-list-view';
import {B2BService} from '../../providers/b2b-service/b2b-service';

@Component({
  templateUrl: 'build/pages/item-details/cap-details.html',
  directives: [PieChart, CORE_DIRECTIVES, SummaryDetail,CollapsiblePane,SwitchViewContainer,CapListView, BarChart],
  providers:[B2BService]
})
export class CapDetails {
  selectedItem: any;
  capList = [];  
  constructor(private navCtrl: NavController, navParams: NavParams, private b2bService:B2BService, public platform: Platform ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.b2bService.loadCapList().then(res=>{
    	this.capList = res.capDetails;
    })
  }

  headerTappedHandler(event){
        let actionSheet = ActionSheet.create({
        title: 'Albums',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            icon: !this.platform.is('ios') ? 'trash' : null,
            handler: () => {
              console.log('Delete clicked');
            }
          },
          {
            text: 'Share',
            icon: !this.platform.is('ios') ? 'share' : null,
            handler: () => {
              console.log('Share clicked');
            }
          },
          {
            text: 'Play',
            icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
            handler: () => {
              console.log('Play clicked');
            }
          },
          {
            text: 'Favorite',
            icon: !this.platform.is('ios') ? 'heart-outline' : null,
            handler: () => {
              console.log('Favorite clicked');
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
    //debugger
  }

}

