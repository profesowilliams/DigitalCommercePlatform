import { Component, Input, OnInit } from '@angular/core';
import { DataCallService } from 'src/app/services/data-call.service';

@Component({
  selector: 'app-chart-comp',
  templateUrl: './chart-comp.component.html',
  styleUrls: ['./chart-comp.component.css']
})
export class ChartCompComponent implements OnInit {
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

  public doughnutChartLabels = ['Unquoted', 'Quoted', 'Old'];
  public doughnutChartData:Array<any> = [100,100,100];
  public doughnutChartType = 'doughnut';
  // public doughnutChartColor = ['rgb(54,192,225)', 'rgb(255,191,50)', 'rgb(0,13,34)'];
  public chartColors: Array<any> = [
    { // all colors in order
      backgroundColor: ['#36c0e1', '#ffbf32', '#000d22']
    }
  ]

  @Input() dataOnClick:Array<any>;

  constructor(private dataService: DataCallService) { }

  ngOnChanges(){
    console.log(this.doughnutChartData, "console 1");
    if(this.dataOnClick){
      this.doughnutChartData = this.dataOnClick;
    }
    console.log(this.doughnutChartData, "console 2");
  }
  ngOnInit() {

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
}



