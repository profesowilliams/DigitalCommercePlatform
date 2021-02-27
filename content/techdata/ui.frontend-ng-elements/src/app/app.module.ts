import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PopupComponent } from './components/popup.component';
import { PopupService } from './components/popup.service';
import {ChartCompComponent} from "./components/chart-comp/chart-comp.component";
import {ChartsModule} from "ng2-charts";
import {ModelManagerService} from "./components/model-manager.service";
import {APP_BASE_HREF} from "@angular/common";


// Include the `PopupService` provider,
// but exclude `PopupComponent` from compilation,
// because it will be added dynamically.

@NgModule({
  imports: [BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule],
  providers: [PopupService, HttpClient, ModelManagerService, { provide: APP_BASE_HREF, useValue: '/' }],
  declarations: [AppComponent, PopupComponent, ChartCompComponent],
  bootstrap: [AppComponent],
  entryComponents: [PopupComponent, ChartCompComponent],
})
export class AppModule {
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/