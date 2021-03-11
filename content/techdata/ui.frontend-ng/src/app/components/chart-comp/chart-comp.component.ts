import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { DataCallService } from 'src/app/services/data-call.service';

@Component({
  selector: 'app-chart-comp',
  templateUrl: './chart-comp.component.html',
  styleUrls: ['./chart-comp.component.css']
})
export class ChartCompComponent implements OnInit {

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
}



