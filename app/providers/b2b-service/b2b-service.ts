import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from '../auth-service/auth-service';

/*
  Generated class for the B2BService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class B2BService {
  data: any;
  capListData: any;
  trendsList: any;
  _platform: any;
  _selectedPrefrences = [];
  PRODUCTS_SUMMARY_URL_: string = 'https://wwwin-spb2b.cisco.com/back2basics/webServices/productsSummaryOld';
  PRODUCTS_SUMMARY_URL: string = 'https://wwwin-spb2b-stage.cisco.com/back2basics/webService/productSummary';

  constructor(private http: Http, private authService: AuthService) {
    this.data = null;
    this.capListData = {};
  }

  load() {
    // don't have the data yet
    return new Promise((resolve, reject) => {
    var headers = new Headers();
    headers.append('Authorization', this.authService.getAuthorization());
    headers.append('Cache-Control', 'no-cache');
    this.http.get(this.PRODUCTS_SUMMARY_URL, {
        headers: headers
    })
    .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          console.log(this.data);
          resolve(this.data);
        }, err => {

           this.http.get('mock-json/data.json')
                    .map(res => res.json())
                        .subscribe(data => {
                          // we've got back the raw data, now generate the core schedule data
                          // and save the data for later reference
                          console.log("THIS is STATIC DATA");
                          this.data = data;
                          console.log(this.data);
                          resolve(this.data);
                        },err => {
                          // we've got back the raw data, now generate the core schedule data
                          // and save the data for later reference
                          //this.data = data;
                          this.data = null;
                          reject(err);
                          });
          
         
        });
    });
  }

  // Method for loading data for caps category only
  loadCapList(category, subCategory) {
    category = category;
    subCategory = subCategory;
        console.log(this._platform);

    var productRef = "product_" + this._platform.product;
    if(this.capListData[productRef]){
      if(this.capListData[productRef][category]){
        if(this.capListData[productRef][category][subCategory]){
          return Promise.resolve(this.capListData[productRef][category][subCategory]);
        }
      }else{
          this.capListData[productRef][category] = {};
      }
    } else {
      this.capListData[productRef] = {};
      this.capListData[productRef][category] = {};
    }

    return new Promise((resolve, reject)=>{
    var headers = new Headers();
    headers.append('Authorization', this.authService.getAuthorization());
    headers.append('Cache-Control', 'no-cache')
     this.http.get('https://wwwin-spb2b.cisco.com/back2basics/webServices/productSubCategoryDetails?productId='+ this._platform.product +'&category='+category+'&subCategory='+subCategory, {
        headers: headers
      })
      .map(res => res.json())
      .subscribe(data => {
        this.capListData[productRef][category][subCategory] = data;
        resolve(this.capListData[productRef][category][subCategory]);
      }, err => {
        reject(err);
      })
    })
  }

  // Method for loading data for all categories coming from the JSON(except CAPS).
  loadOtherList(category, subCategory) {
    console.log(this._platform);
    var productRef = "product_" + this._platform.product;
    if(this.capListData[productRef]){
      if(this.capListData[productRef][category]){
        if(this.capListData[productRef][category][subCategory]){
          return Promise.resolve(this.capListData[productRef][category][subCategory]);
        }
      }else{
          this.capListData[productRef][category] = {};
      }
    } else {
      this.capListData[productRef] = {};
      this.capListData[productRef][category] = {};
    }

    return new Promise((resolve, reject)=>{
    var headers = new Headers();
    headers.append('Authorization', this.authService.getAuthorization());
    headers.append('Cache-Control', 'no-cache')
     this.http.get('https://wwwin-spb2b.cisco.com/back2basics/webServices/productSubCategoryDetails?productId='+ this._platform.product +'&category='+category+'&subCategory='+subCategory, {
        headers: headers
      })
      .map(res => res.json())
      .subscribe(data => {
        this.capListData[productRef][category][subCategory] = data;
        resolve(this.capListData[productRef][category][subCategory]);
      }, err => {
        reject(err);
      })
    })
  }

  // filter data to 'Others' key from array
  filterKeyFromData(data){
    var arr = [];
    var l = data.length;
    for(var i=0; i<l; i++){
      //if("Others" != data[i].subType){
        arr.push({"subType": data[i].subType, "value": data[i].value});
      //}
    }
    return arr;
  }

  changeTableHeightHandler(collapsed){
    var listView = document.getElementsByClassName("list-view")[0];
    var innerDiv:any;
    /*var innerDiv = (listView && listView['children'] && listView['children'][1]) ? listView['children'][1] : undefined;
    if(!innerDiv){
      innerDiv = listView.getElementsByClassName("inner_table");
    }*/
    innerDiv = listView.getElementsByClassName("inner_table");
    if(innerDiv == undefined){
      return;
    }
    console.log(innerDiv);
    debugger
    //alert("Coming here");
    if(collapsed){
      listView['style'].height = "295px";
      Array.from(innerDiv).forEach(d => {
        d['style'].height = "265px";
      })
      //innerDiv['style'].height = "265px";
    }
    else{
      listView['style'].height = "178px";
      Array.from(innerDiv).forEach(d => {
        d['style'].height = "150px";
      })
      //innerDiv['style'].height = "150px";
    }
    listView['style'].overflowY = "hidden";
    //innerDiv['style'].overflowY = "hidden";
    Array.from(innerDiv).forEach(d => {
      d['style'].overflowY = "hidden";
    })
    setTimeout(() => {
      //listView['style'].overflowY = "auto";
      //innerDiv['style'].overflowY = "auto";
      Array.from(innerDiv).forEach(d => {
        d['style'].overflowY = "auto";
      })
    }, 500);
  }

  setSelectedPlatform(platform) {
    this._platform = platform;
  }

  getSelectedPlatform() {
    return this._platform;
  }

  setSelectedPrefrences(prefrences) {
    this._selectedPrefrences = prefrences;
  }

  getSelectedPrefrences() {
    return this._selectedPrefrences;
  }
}
