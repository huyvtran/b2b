import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {NavController, NavParams, ActionSheet, Platform, Events} from 'ionic-angular';
import {PieChart} from '../../components/pie-chart/pie-chart';
import {MultiSeriesChart} from '../../components/multi-series-chart/multi-series-chart';
import {SummaryDetail} from '../../components/summary-detail/summary-detail';
import {CollapsiblePane} from '../../components/collapsible-pane/collapsible-pane';
import {SwitchViewContainer} from '../../components/switch-view/switch-view';
import {CapListView} from '../../components/cap-list-view/cap-list-view';
import {GenericListView} from '../../components/generic-list-view/generic-list-view';
import {B2BService} from '../../providers/b2b-service/b2b-service';
import {Toast} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/item-details/preference-details.html',
  directives: [PieChart, CORE_DIRECTIVES, SummaryDetail, CollapsiblePane, SwitchViewContainer, CapListView, MultiSeriesChart, GenericListView]
})
export class PreferenceDetail {
  selectedItem: any;
  pageTitle: any;
  capList = [];
  trendsList = [];
  pieChartDataProvider = [];
  tableHeaderText: string;
  chartHeaderText: string;
  isVisible: boolean;
  subCategories: string;
  selectedIndex: number;
  info="";
  noDataText:string;
  constructor(private navCtrl: NavController, navParams: NavParams, private b2bService: B2BService, private platform: Platform, private events: Events) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
	  this.selectedIndex = navParams.get('index');
	  this.subCategories = this.selectedItem.subCategories[this.selectedIndex].name;
    this.pageTitle = navParams.get('title');
  }

  ngOnInit() {
    this.initializeData({ value: this.selectedIndex});
  }

  prepareChartData(data) {
    var tmpObj = {};
    var preparedData = [];
    for (let i = 0; i < data.length; i++) {
      let t = data[i].capLevel || data[i].subType;
      if (tmpObj[t]) {
        tmpObj[t].y++;
      } else {
        tmpObj[t] = {
          name: t,
          y: 1
        }
      }
    }
    for (let i in tmpObj) {
      preparedData.push(tmpObj[i]);
    }
    return preparedData;
  }

  initializeData(data) {
    this.capList = [];
    this.pieChartDataProvider = [];
    this.trendsList = [];
    this.info = "";
    var subCategoryItemvalue=this.selectedItem.subCategories[data.value].value.replace('d','');    
    //Cases to check what text to display on No Data Screen
    if(subCategoryItemvalue=="N"){
      this.noDataText="Under Construction"
    }
    else if(subCategoryItemvalue=="U") {
      this.noDataText="Data Not Available";
    }
    this.setVisibilityOfNoDataScreen(subCategoryItemvalue);
    //Managing Header text for table and chart
    if(this.selectedItem.subCategories[data.value].name == "Resolve Time"){               
      this.chartHeaderText="Age Distribution of CAPs by Level"
      this.tableHeaderText="CAP "+"Resolution Time";
    }else{
      this.chartHeaderText="Incoming and Open Cap Trend";
      this.tableHeaderText=this.selectedItem.subCategories[data.value].name +" CAPs";
    } 

    this.b2bService.loadCapList(this.selectedItem.name, this.selectedItem.subCategories[data.value].name).then(res => {      
      this.capList = res.subCategoryDetails;
      this.pieChartDataProvider = this.prepareChartData(res.subCategoryDetails);
      this.trendsList = res.trendDetails;
      this.info = res.info;
    }, err => {
      this.events.publish('data:load_error', err);
    });
  }
  /**
  *  Displaying a toast message on the screen
  *  @params message: message which needs to be displayed
  *  position: position on screen , center, bottom. 
  */
  showToast(message, position) {
    Toast.show(message, "short", position).subscribe(
      toast => {
      }
    );
  }
  selectionChangedHandler(data) {
    this.initializeData(data);
    this.subCategories = this.selectedItem.subCategories[data.value].name;
  }

  //for removing SP and SP-
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
  
  setVisibilityOfNoDataScreen(subCategoryValue) {
    if(!isNaN(subCategoryValue)){
        this.isVisible=true;
      }else{
        this.isVisible=false;
      }
  }
}
