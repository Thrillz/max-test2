import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  baseUrl: string = "https://sandbox.max.ng";

  constructor(private http: Http) { }

  //get user price
  getPrice(body: Object): Observable<any> {
    console.log(body);
    return this.http.post(`${this.baseUrl}/v1/pricings/estimate`, body)
    .map(res => res.json().data)
    .catch(this.handleError);
  }

  //handle any errors from the api
  private handleError(err) {

    let errMessage: string;

    if (err instanceof Response) {
      let body = err.json() || "";
      let error = body.error || JSON.stringify(body);
      errMessage = `${err.status} - ${err.statusText || ''} ${error}`;
    } else {
      errMessage = err.message ? err.message : err.toString();
    }

    return Observable.throw(errMessage);
  }

}
