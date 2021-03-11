import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { ApiDataModel } from '../models/api-data/api-data.model'


@Injectable({
  providedIn: 'root'
})
export class DataCallService {

  onClickSubject: Subject<any>;

  constructor(private http:HttpClient) { 

  }
  getData(url){
    console.log("getData");
    // return this.http.get<ApiDataModel>("https://api.npoint.io/333c60f461e85093f106");
    return this.http.get<ApiDataModel>(url);
  }
  
  getDataOnClick(url){
    console.log("getDataOnClick");
    return this.http.get<ApiDataModel>(url);
  }
}

// "https://api.npoint.io/4c82d3e004a8a98766a0"