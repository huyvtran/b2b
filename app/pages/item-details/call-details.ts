import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {NavController, NavParams} from 'ionic-angular';
import {PieChart} from '../../components/pie-chart/pie-chart';
import {BarChart} from '../../components/bar-chart/bar-chart';
import {SummaryDetail} from '../../components/summary-detail/summary-detail';
import {CollapsiblePane} from '../../components/collapsible-pane/collapsible-pane';
import {SwitchViewContainer} from '../../components/switch-view/switch-view';
import {B2BService} from '../../providers/b2b-service/b2b-service';
import {CapListView} from '../../components/cap-list-view/cap-list-view';

@Component({
  templateUrl: 'build/pages/item-details/call-details.html',
  directives: [CapListView, PieChart,BarChart, CORE_DIRECTIVES, SummaryDetail,CollapsiblePane,SwitchViewContainer],
  providers:[B2BService]
})
export class CallDetails {
  selectedItem: any;
  capList = [];  
  constructor(private navCtrl: NavController, navParams: NavParams,private b2bService:B2BService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.b2bService.loadCapList().then(res=>{
    	this.capList = res.caps;
    })
  }  
}

