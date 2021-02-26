/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Constants } from '@adobe/aem-angular-editable-components';
import { ModelManager } from '@adobe/aem-spa-page-model-manager';
import { Component } from '@angular/core';
import { DataCallService } from './services/data-call.service';

@Component({
  selector: '#spa-root', // tslint:disable-line
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  items: any;
  itemsOrder: any;
  path: any;

  chart1data: Array<any>;
  chart2data: Array<any>;
  chart3data: Array<any>;

  // APIs for Each Flush Component On Load 
  OnLoadCustomerData = 'https://api.npoint.io/1e61075994ef050c97fb';
  OnloadSalesData = 'https://api.npoint.io/57189859b618bd5ae918';
  OnloadProductionData = 'https://api.npoint.io/4c82d3e004a8a98766a0';
  
  // APIs for Each Flush Component On Button Click 
  OnClickCustomerData = 'https://api.npoint.io/c6e052996d879b4a69c1';
  OnClickSalesData = 'https://api.npoint.io/a907d34a6b8470e5a38c';
  OnClickProductionData = 'https://api.npoint.io/489ec7f38bd636c6f27f';

  apiData;

  constructor(private dataService: DataCallService) {
    ModelManager.initialize().then(this.updateData);
  }

  private updateData = pageModel => {
    this.path = pageModel[Constants.PATH_PROP];
    this.items = pageModel[Constants.ITEMS_PROP];
    this.itemsOrder = pageModel[Constants.ITEMS_ORDER_PROP];
  }

  
    getClickDataFromService(chartNumber, url){
        this.dataService.getDataOnClick(url).subscribe(data => {
            let apiData = JSON.parse(JSON.stringify(data.data));
            if (chartNumber == 'customerData'){
                this.chart1data = apiData;
              }else if(chartNumber == 'salesData'){
                this.chart2data = apiData;
              }else if(chartNumber == 'prodData'){
                this.chart3data = apiData;
              }
          })
    }

  ngOnInit() {
    this.dataService.getData(this.OnLoadCustomerData).subscribe(data => {
      console.log(data.data,"OnLoadCustomerData");
      let apiData = JSON.parse(JSON.stringify(data.data));
      this.chart1data = apiData;
      });
      this.dataService.getData(this.OnloadSalesData).subscribe(data => {
        let apiData = JSON.parse(JSON.stringify(data.data));
      this.chart2data = apiData;
      });
      this.dataService.getData(this.OnloadProductionData).subscribe(data => {
        let apiData = JSON.parse(JSON.stringify(data.data));
        // console.log(data.data, "OnloadProductionData");
        this.chart3data = apiData;
      });   
  }
}