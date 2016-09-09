import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
  data: Object;
  authorization: string;
  OAUTH_URL: string = 'https://cloudsso.cisco.com/as/token.oauth2';
  //OAUTH_URL: string = 'https://cloudsso-test.cisco.com/as/token.oauth2';
  props: Array<string> = ['access_token', 'refresh_token', 'token_type', 'expires_in'];
  propsPrefix: string = '$b2b$';
  ENV: string = 'prod'; // dev, cisco, prod

  constructor(private http: Http) {
    this.data = null;
    this.loadData();
  }

  authenticate(credentials, rememberMe) {
    if(credentials.username) credentials.username = credentials.username.trim();

    let creds = "client_id=m6hgwkg3893tycmttefe7wsn&client_secret=m7qpUM3YrACgEZtcHx4RGVgw&grant_type=password&username=" + credentials.username + "&password=" + credentials.password;

    this.clearStorage();

    // don't have the data yet
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
      let options = new RequestOptions({
        headers: headers
      });
      this.http.post(this.OAUTH_URL, creds, options)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          if(this.ENV === 'cisco') {
            data.token_type = 'Basic';
            data.access_token = window.btoa(credentials.username + ':' + credentials.password);
          }
          this.data = data;
          this.saveData(this.data, rememberMe);
          this.loadData();
          resolve(this.data);
        }, err => {
          if (err.status == 0) {
            reject({
              'error': 'Error',
              'error_description': 'Access control not enabled for this origin.'
            });
          } else {
            reject(JSON.parse(err._body));
          }
        });
    });
  }

  saveData(data, rememberMe) {
    if (!data) return;

    let storage = rememberMe ? localStorage : sessionStorage;
    for(let name in data) {
      this.save(storage, name, data[name]);
    }
  }

  loadData() {
    if(this.load('access_token')) {
      this.authorization = this.load('token_type') + ' ' + this.load('access_token');
    } else {
      this.authorization = null;
    }
  }

  implicitLogin(data) {
    this.clearStorage();
    this.data = data;
    this.saveData(this.data, true);
    this.loadData();
  }

  isAuthenticated() {
    return this.getAuthorization() ? true : false;
  }

  getAuthorization() {
    return this.authorization;
  }

  logout() {
    this.clearStorage();
  }

  clearStorage() {
    this.data = null;
    let self = this;
    this.props.forEach(function(name) {
      self.save(sessionStorage, name, null);
      self.save(localStorage, name, null);
    });
  }

  save(storage, name, value) {
    try {
      let key = this.propsPrefix + name;
      if (value == null) value = '';
      storage[key] = value;
    } catch (err) {
      //console.log('Cannot access local/session storage: ', err);
    }
  }

  load(name) {
    let key = this.propsPrefix + name;
    return localStorage[key] || sessionStorage[key] || null;
  }
}
