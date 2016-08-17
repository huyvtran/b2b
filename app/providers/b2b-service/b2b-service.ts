import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the B2BService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class B2BService {
  data: any;
  capListData:any
  _platform:any

  constructor(private http: Http) {
    this.data = null;
    this.capListData = null;
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise((resolve, reject) => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      //http://private-c58bd9-naveen4nkp.apiary-mock.com/getdashboard
      this.http.get('mock-json/data.json')
	  //this.http.get('http://wwwin-spb2b-stage.cisco.com/back2basics/webServices/getPlatformsSummary')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        },err => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          //this.data = data;
          reject(err);
        });
    });
  }

  loadCapList(){
    if(this.capListData){
      return Promise.resolve(this.capListData);
    }
    return new Promise((resolve,reject)=>{
      this.http.get('mock-json/cap-list.json')
      .map(res => res.json())
      .subscribe(data => {
        this.capListData = data;
        resolve(this.capListData);
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

