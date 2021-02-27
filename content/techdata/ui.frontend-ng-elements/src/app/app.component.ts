import {Component, Injector, OnInit} from '@angular/core';
import {createCustomElement, NgElement, WithProperties} from '@angular/elements';
import { PopupComponent } from './components/popup.component';
import { ChartCompComponent } from './components/chart-comp/chart-comp.component';
import {PopupService} from "./components/popup.service";
import { DataCallService } from './services/data-call.service';
import { Constants } from '@adobe/aem-angular-editable-components';
import { ModelManager } from '@adobe/aem-spa-page-model-manager';



const componentMapping = {
  "pop-up" : {
    "componentName" : PopupComponent,
    "componentSelector" : "popup-element"
  },
  "chart" : {
    "componentType" : ChartCompComponent,
    "componentSelector" : "chart-element"
  },
}

@Component({
  selector: 'app-root',
  template: `
    <div></div>
  `,
})
export class AppComponent implements OnInit {
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

  constructor(injector: Injector, public popup: PopupService, private dataService: DataCallService) {
    // Convert `PopupComponent` to a custom element.
    ModelManager.initialize().then(this.updateData);

    const PopupElement = createCustomElement(PopupComponent, {injector});
    const ChartElement = createCustomElement(ChartCompComponent, {injector});
    // Register the custom element with the browser.
    customElements.define('popup-element', PopupElement);
    customElements.define('chart-element', ChartElement);
  }

  private updateData = pageModel => {
    this.path = pageModel[Constants.PATH_PROP];
    this.items = pageModel[Constants.ITEMS_PROP];
    this.itemsOrder = pageModel[Constants.ITEMS_ORDER_PROP];
  }

  getDataOnClick(chartNumber){
    if (chartNumber == 'customerData'){
      this.getClickDataFromService(chartNumber, this.OnClickCustomerData)
    }else if(chartNumber == 'salesData'){
      this.getClickDataFromService(chartNumber, this.OnClickSalesData)
    }else if(chartNumber == 'prodData'){
      this.getClickDataFromService(chartNumber, this.OnClickProductionData)
    }
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




  // implement OnInit's `ngOnInit` method
  ngOnInit() {
    console.log("AppComponent oninit");
    let components = document.querySelectorAll("div[data-component]");

    for (let i = 0; i < components.length; i++) {
      let componentName = components[i].getAttribute("data-component");
      console.log ("componentName " + componentName);

      let elementTag = componentMapping[componentName]["componentSelector"];
      let currentComponent = componentMapping[componentName]["componentType"];

      console.log ("Mapping Name  " + elementTag);
      const popupEl: NgElement & WithProperties<typeof currentComponent> = document.createElement(elementTag) as any;
      // Listen to the close event
      popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));
      // Set the message

      // Add to the DOM
      components[i].appendChild(popupEl);
    }

  //  chart component oninit
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


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/