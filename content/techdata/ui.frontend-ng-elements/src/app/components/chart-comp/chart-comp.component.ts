import {Component, Input, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { DataCallService } from 'src/app/services/data-call.service';
import {ChartDataModel} from './chart-config-data.model'

@Component({
  selector: 'app-chart-comp',
  templateUrl: './chart-comp.component.html',
  styleUrls: ['./chart-comp.component.css']
})
export class ChartCompComponent implements AfterViewInit {
  items: any;
  itemsOrder: any;
  path: any;
  dataConfig = new ChartDataModel()

  @ViewChild("baseChart1") componentViewEl;

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

  url = ""
  public doughnutChartLabels = ['Unquoted', 'Quoted', 'Old'];
  public doughnutChartData:Array<any> = [100,100,100];
  public doughnutChartType = 'doughnut';
  public chartColors: Array<any> = [
    { // all colors in order
      backgroundColor: ['#36c0e1', '#ffbf32', '#000d22']
    }
  ]

  @Input() dataOnClick:Array<any>;

  constructor(private dataService: DataCallService) {

  }

  init() : void {
    console.log("init from within chart component")
    let componentEl = this.componentViewEl.nativeElement.closest("[data-component]")
    let configJson = componentEl.getAttribute("data-cmp-config");
    let initialJson = JSON.parse(configJson)
    this.dataConfig.data = initialJson;
    console.log(this.dataConfig)
    this.url = this.dataConfig.data["xdm:text"]
  }

  ngAfterViewInit(): void {
    console.log("on view init")
    this.init()
    this.loadChart()
  }

  loadChart()
  {

    if(this.dataConfig.data.refreshOnLoad) {
      this.dataService.getDataOnClick(this.url).subscribe(data => {
        console.log(data)
        let apiData = JSON.parse(JSON.stringify(data.data));
        console.log(apiData)
        this.doughnutChartData = apiData
      })
    }
  }

  getClickDataFromService(){

    if (this.url) {
      this.dataService.getDataOnClick(this.url).subscribe(data => {
        console.log(data)
        let apiData = JSON.parse(JSON.stringify(data.data));
        console.log(apiData)
        this.doughnutChartData = apiData
      })
    }else{
      console.error("url not found in config")
    }

  }

}



