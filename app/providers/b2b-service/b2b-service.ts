import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthService} from '../auth-service/auth-service';

/*
  Generated class for the B2BService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class B2BService {
  data: any;
  capListData:any;
  trendsList:any;
  _platform:any;
  _selectedPrefrences=[];

  constructor(private http: Http, private authService:AuthService) {
    this.data = null;
    this.capListData = {};
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise((resolve, reject) => {
    //this.http.get('mock-json/data.json')

    var headers = new Headers();
    headers.append('Authorization', this.authService.getAuthorization());
    headers.append('Cache-Control', 'no-cache')
    this.http.get('https://wwwin-spb2b.cisco.com/back2basics/webServices/productsSummaryOld', {
        headers: headers
    })


    .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          console.log("Got Data");
          this.data = data;
          resolve(this.data);
        },err => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          //this.data = data;
          console.log("This is static data");

          //in case data url auth fail in any scenario.....
          headers.append('Authorization', 'Basic c2t1bWFyOTpBdWdfMjAxNg==');
          headers.append('Cache-Control', 'no-cache')
          this.http.get('https://wwwin-spb2b.cisco.com/back2basics/webServices/productsSummaryOld', {
          headers: headers
          })
          //------------------------------------------------
          //reject(err);
        });
    });
  }
 // Method for loading data for caps category only
  loadCapList(category, subCategory){
    //category = category.toLowerCase();
    //subCategory = subCategory.toLowerCase();
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

    return new Promise((resolve,reject)=>{
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
        console.log("Got Data from API");
      },err => {
        /*
        Modifications in variable name to add underscore in place of space to make it 
        in sync with json file name. This change is done only for static data.
        */
        subCategory = subCategory.replace(" ","_");
        category = category.replace(" ","_");
        this.http.get('mock-json/'+category+'_'+subCategory+'.json')
        .map(res => res.json())
        .subscribe(data => {
          console.log("Static Data");
          this.capListData[productRef][category][subCategory] = data;
          resolve(this.capListData[productRef][category][subCategory]);
        },err => {
         reject(err);
        })
      })
    })
  }
  // Method for loading data for all categories coming from the JSON(except CAPS).
  loadOtherList(category, subCategory){
    //category = category.toLowerCase();
    //subCategory = subCategory.toLowerCase();

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

    return new Promise((resolve,reject)=>{
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
        console.log("Got Data from API");
      },err => {
        /*
        Modifications in variable name to add underscore in place of space to make it 
        in sync with json file name. This change is done only for static data.
        */
        subCategory = subCategory.replace(" ","_");
        category = category.replace(" ","_");
        this.http.get('mock-json/'+category+'_'+subCategory+'.json')
        .map(res => res.json())
        .subscribe(data => {
          console.log("Static Data");
          category = category.replace("_"," ");
          this.capListData[productRef][category][subCategory] = data;
          resolve(this.capListData[productRef][category][subCategory]);
        },err => {
         reject(err);
        })
      })
    })
  }
  

  setSelectedPlatform(platform){
    this._platform = platform;
  }

  getSelectedPlatform(){
    return this._platform;
  }

  setSelectedPrefrences(prefrences){
    this._selectedPrefrences = prefrences;
  }

  getSelectedPrefrences(){
    return this._selectedPrefrences;
  }
}
