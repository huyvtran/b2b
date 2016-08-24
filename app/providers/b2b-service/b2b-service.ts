import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

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

  constructor(private http: Http) {
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

    headers.append('Host', 'wwwin-spb2b.cisco.com')
    headers.append('Authorization', 'Basic c2t1bWFyOTpBdWdfMjAxNg==');
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

                    this.http.get('mock-json/data.json')
                    .map(res => res.json())
                        .subscribe(data => {
                          // we've got back the raw data, now generate the core schedule data
                          // and save the data for later reference
                          console.log("THIS is STATIC DATA");
                          this.data = data;
                          resolve(this.data);
                        },err => {
                          // we've got back the raw data, now generate the core schedule data
                          // and save the data for later reference
                          //this.data = data;
                          reject(err);
                          });
          //reject(err);
        });
    });
  }

  loadCapList(category, subCategory){
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
    headers.append('Host', 'wwwin-spb2b.cisco.com')
    headers.append('Authorization', 'Basic c2t1bWFyOTpBdWdfMjAxNg==');
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
        this.http.get('mock-json/caps_open.json')
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
  loadOtherList(category, subCategory){
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
    headers.append('Host', 'wwwin-spb2b.cisco.com')
    headers.append('Authorization', 'Basic c2t1bWFyOTpBdWdfMjAxNg==');
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
  loadTrends(){
   return new Promise((resolve,reject)=>{
     this.http.get('mock-json/TREND_data_provider.json')
     .map(res => res.json())
     .subscribe(data => {
       this.trendsList = data;
       resolve(this.trendsList);
     },err => {
       reject(err);
     })
   })
  }

  setSelectedPlatform(platform){
    this._platform = platform;
  }

  getSelectedPlatform(){
    return this._platform;
  }
}
