import {Injector, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {createCustomElement, NgElement, WithProperties} from '@angular/elements';


import { PopupComponent } from './components/popup.component';
import { PopupService } from './components/popup.service';
import {ChartCompComponent} from "./components/chart-comp/chart-comp.component";
import {ChartsModule} from "ng2-charts";
import {ModelManagerService} from "./components/model-manager.service";
import {APP_BASE_HREF} from "@angular/common";
import {DataCallService} from "./services/data-call.service";
import {ModelManager} from "@adobe/aem-spa-page-model-manager";
 import {Constants} from "@adobe/aem-angular-editable-components";


// Include the `PopupService` provider,
// but exclude `PopupComponent` from compilation,
// because it will be added dynamically.

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

@NgModule({
  imports: [BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule],
  providers: [PopupService, HttpClient, ModelManagerService, { provide: APP_BASE_HREF, useValue: '/' }],
  declarations: [PopupComponent, ChartCompComponent],
  // bootstrap: [AppComponent],
  entryComponents: [PopupComponent, ChartCompComponent],
})
export class AppModule {

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

  ngDoBootstrap(app) {
    console.log("app module bootstrap");
    let components = document.querySelectorAll("div[data-component]");
    console.log(components);
      for (let i = 0; i < components.length; i++) {
        let componentName = components[i].getAttribute("data-component");
        console.log ("componentName " + componentName);

        let elementTag = componentMapping[componentName]["componentSelector"];
        let currentComponent = componentMapping[componentName]["componentType"];

        console.log ("Mapping Name  " + elementTag);
        const popupEl: NgElement & WithProperties<typeof currentComponent> = document.createElement(elementTag) as any;

        console.log(popupEl)
        // Add to the DOM
        components[i].appendChild(popupEl);
    }
  }

  constructor(injector: Injector, public popup: PopupService, private dataService: DataCallService) {
    // Convert `PopupComponent` to a custom element.
    console.log("inside app module constructor");

    const PopupElement = createCustomElement(PopupComponent, {injector});
    const ChartElement = createCustomElement(ChartCompComponent, {injector});
    // Register the custom element with the browser.
    customElements.define('popup-element', PopupElement);
    customElements.define('chart-element', ChartElement);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/