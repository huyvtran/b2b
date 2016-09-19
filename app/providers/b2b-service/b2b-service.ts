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
  PRODUCTS_SUMMARY_URL: string = 'https://wwwin-spb2b.cisco.com/back2basics/webServices/productsSummaryOld';

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
          resolve(this.data);
        }, err => {
          this.data = null;
          reject(err);
        });
    });
  }

  // Method for loading data for caps category only
  loadCapList(category, subCategory) {
    category = category;
    subCategory = subCategory;
    var productRef = "product_" + this._platform.ID;
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
     this.http.get('https://wwwin-spb2b.cisco.com/back2basics/webServices/productSubCategoryDetails?productId='+ this._platform.ID +'&category='+category+'&subCategory='+subCategory, {
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
    var productRef = "product_" + this._platform.ID;
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
     this.http.get('https://wwwin-spb2b.cisco.com/back2basics/webServices/productSubCategoryDetails?productId='+ this._platform.ID +'&category='+category+'&subCategory='+subCategory, {
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
      if("Others" != data[i].subType){
        arr.push({"subType": data[i].subType, "value": data[i].value});
      }
    }
    return arr;
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
