import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {NavController, NavParams, ActionSheet, Platform, Events} from 'ionic-angular';
import {PieChart} from '../../components/pie-chart/pie-chart';
import {MultiSeriesChart} from '../../components/multi-series-chart/multi-series-chart';
import {SummaryDetail} from '../../components/summary-detail/summary-detail';
import {CollapsiblePane} from '../../components/collapsible-pane/collapsible-pane';
import {SwitchViewContainer} from '../../components/switch-view/switch-view';
import {B2BService} from '../../providers/b2b-service/b2b-service';
import {Toast} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/item-details/hardware-return-details.html',
  directives: [PieChart, CORE_DIRECTIVES, SummaryDetail, CollapsiblePane, SwitchViewContainer, MultiSeriesChart]
})
export class HardwareDetails {
  selectedItem: any;
  pageTitle: any;
  casesList = [];
  trendsList = [];
  rmaOpenTableData = {};
  selectedSubCategory: string;
  pieChartDataProvider = [];
  tableHeaderText: string;
  chartHeaderText: string;
  selectedIndex: number;
  isVisible: boolean;
  info = "";
  noDataText: string;

  constructor(private navCtrl: NavController, navParams: NavParams, private b2bService: B2BService, private platform: Platform, private events: Events) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.selectedIndex = navParams.get('index');
    this.selectedSubCategory = this.selectedItem.subCategories[this.selectedIndex].name;
    this.pageTitle = navParams.get('title');
  }

  ngOnInit() {
    this.initializeData({ value: this.selectedIndex });
  }

  initializeData(data) {
    this.rmaOpenTableData = {};
    this.casesList = [];
    this.pieChartDataProvider = [];
    this.info = "";
    this.trendsList = [];

    //Replacing 'd' with blank to display data for values having 'd' in it and
    //check if it can be converted to a valid number or not.
    var subCategoryItemvalue = this.selectedItem.subCategories[data.value].value.replace('d', '');

    //Cases to check what text to display on No Data Screen

    if (subCategoryItemvalue == "N") {
      this.noDataText = "Under Construction"

    }
    else if (subCategoryItemvalue == "U") {
      this.noDataText = "Data Not Available";
    }
    this.setVisibilityOfNoDataScreen(subCategoryItemvalue);


    //Managing Header text for table and chart
    if (this.selectedItem.subCategories[data.value].name == "Resolve Time") {

      this.chartHeaderText = "RMA Resolution Trend"
      this.tableHeaderText = "RMA " + "Resolution Time";
    }
    else if (this.selectedItem.subCategories[data.value].name == "Open") {

      this.chartHeaderText = "In Process RMA Trend"
      this.tableHeaderText = "In Process " + "RMAs";
    }
    else {
      this.chartHeaderText = "Resolution Trend"
      this.tableHeaderText = "Open " + this.selectedItem.subCategories[data.value].name;
    }
    this.b2bService.loadOtherList(this.selectedItem.name, this.selectedItem.subCategories[data.value].name).then(res => {
      this.rmaOpenTableData = this.setRMAOpenTableData(res.subCategoryDetails);
      //this.casesList = res.subCategoryDetails;
      this.pieChartDataProvider = this.prepareChartData(res.subCategoryDetails);
      this.info = res.info;
      this.trendsList = res.trendDetails;
    }, err => {
      this.events.publish('data:load_error', err);
    });
  }

  setRMAOpenTableData(data) {
    var arr = [];
    var l = data.length;
    for(var i=0; i<l; i++){
      if(arr.indexOf(data[i].type) == -1){
        arr.push(data[i].type);
      }
      arr.sort();
    }
    var o = {};
    var a = [];
    o["natureType"] = arr[0];
    o["topCustType"] = arr[1];
    var a1 = [];
    var a2 = [];
    for(var m=0; m<l; m++){
      if((o["natureType"] == data[m].type) && (data[m].subType != "Others")){
        a1.push({"subType": data[m].subType, "value": data[m].value});
      }
      else if((o["topCustType"] == data[m].type) && (data[m].subType != "Others")){
        a2.push({"subType": data[m].subType, "value": data[m].value});
      }
    }
    var len = a1.length > a2.length ? a1.length : a2.length;
    for(var k=0; k<len; k++)
    {
        var typeObj = {};
        typeObj["natureSubType"] = (a1[k] && a1[k].subType) ? a1[k].subType : "";
        typeObj["natureValue"] = (a1[k] && a1[k].value) ? a1[k].value : "";
        typeObj["topSubType"] = (a2[k] && a2[k].subType) ? a2[k].subType : "";
        typeObj["topValue"] = (a2[k] && a2[k].value) ? a2[k].value : "";
        a.push(typeObj);
    }
    o["data"] = a;
    return o;
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
        tmpObj[t].y += (isNaN(data[i].value) ? 0 : data[i].value);
      } else {
        tmpObj[t] = {
          name: t,
          y: isNaN(data[i].value) ? 0 : (+data[i].value)
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
  /*
  ** Displaying a toast message on the screen
  @params message: message which needs to be displayed
          position: position on screen , center, bottom.
  */
  showToast(message, position) {
    Toast.show(message, "short", position).subscribe(
      toast => {
      }
    );
  }

  setVisibilityOfNoDataScreen(subCategoryValue) {
    if (!isNaN(subCategoryValue)) {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
  }
}
