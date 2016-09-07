import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

/*
  Generated class for the NetworkService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NetworkService {
  _URL: string = 'https://wwwin-spb2b.cisco.com/back2basics/webServices/productsSummaryOld';
  VPN_NOT_CONNECTED: string = 'cisco_vpn_not_connected';
  TIMEOUT: number = 6*1000; // 6 seconds

  constructor(private http: Http, private platform: Platform) {
  }

  checkConnection() {
    // don't have the data yet
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Cache-Control', 'no-cache');
      let options = new RequestOptions({
        headers: headers
      });
      this.http.get(this._URL, options)
		.timeout(this.TIMEOUT, this.VPN_NOT_CONNECTED)
        .map(res => res.json())
        .subscribe(data => {
          resolve();
        }, err => {
          if (err == this.VPN_NOT_CONNECTED || err.status == 0) {
            let errorMsg = 'Please ensure connectivity to Cisco Network !';
            if(this.platform.is('ios')) errorMsg = 'Please ensure connectivity to Cisco Network';
            reject({
              'error': 'error',
              'error_description': errorMsg
            });
          } else {
            resolve();
          }
        });
    });
  }
}
