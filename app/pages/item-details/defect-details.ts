import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {NavController, NavParams, ActionSheet, Platform} from 'ionic-angular';
import {PieChart} from '../../components/pie-chart/pie-chart';
import {MultiSeriesChart} from '../../components/multi-series-chart/multi-series-chart';
import {SummaryDetail} from '../../components/summary-detail/summary-detail';
import {CollapsiblePane} from '../../components/collapsible-pane/collapsible-pane';
import {SwitchViewContainer} from '../../components/switch-view/switch-view';
import {B2BService} from '../../providers/b2b-service/b2b-service';
import {Toast} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/item-details/defect-details.html',
  directives: [PieChart, CORE_DIRECTIVES, SummaryDetail, CollapsiblePane, SwitchViewContainer, MultiSeriesChart]
})
export class DefectDetails {
  selectedItem: any;
  pageTitle: any;
  casesList = [];
  trendsList = [];
  selectedSubCategory:string;
  pieChartDataProvider = [];
  tableHeaderText:string;
  chartHeaderText:string;
  selectedIndex:number;
   isVisible: boolean;
  constructor(private navCtrl: NavController, navParams: NavParams, private b2bService: B2BService, private platform: Platform) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
	this.selectedIndex = navParams.get('index');
	
    this.selectedSubCategory = this.selectedItem.subCategories[this.selectedIndex].name;
    this.pageTitle = navParams.get('title');
    this.initializeData({ value: this.selectedIndex });
  }
  initializeData(data) {
    this.b2bService.loadOtherList(this.selectedItem.name, this.selectedItem.subCategories[data.value].name).then(res => {
      this.casesList = res.subCategoryDetails;
      this.pieChartDataProvider = this.prepareChartData(res.subCategoryDetails);
      this.trendsList = res.trendDetails;
       if(parseInt(this.selectedItem.subCategories[data.value].value, 10)>0){
        this.isVisible=true;
      }else{
        this.isVisible=false;
      }
       if(this.selectedItem.subCategories[data.value].name == "Resolve Time"){        
       
        this.chartHeaderText="Cumulative Resolution Trend"
        this.tableHeaderText="Defects "+"Resolution Time";
      }
      else if(this.selectedItem.subCategories[data.value].name == "Open"){        
       
        this.chartHeaderText="Incoming and Open Defect Trend";
        this.tableHeaderText="Open "+"Defects";
      }
      else{
        this.chartHeaderText="Incoming and Open "+this.selectedItem.subCategories[data.value].name+" Trend";
        this.tableHeaderText="Open "+this.selectedItem.subCategories[data.value].name+" Defects";
      }  
    })
  }

  selectionChangedHandler(data) {
    this.selectedSubCategory = this.selectedItem.subCategories[data.value].name;
    this.initializeData(data);
  }

  prepareChartData(data) {
      var tmpObj = {};
      var preparedData = [];
      for (let i = 0; i < data.length; i++) {
          let t = data[i].subType;
          if (tmpObj[t]) {
              data[i].value && data[i].value;
              tmpObj[t].y += (isNaN(data[i].value)?0:data[i].value);
          } else {
              data[i].value = data[i].value;
              tmpObj[t] = {
                  name: t,
                  y: isNaN(data[i].value)?0:(+data[i].value)
              }
          }
      }
      for (let i in tmpObj) {
          i != "Others" && preparedData.push(tmpObj[i]);
      }
      return preparedData;
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
   showToast(message, position) {
      Toast.show(message, "short", position).subscribe(
          toast => {
              console.log(toast);
          }
      );
  }
}
