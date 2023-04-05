import { Component, Input } from '@angular/core';
import { ChartData, ChartType, Color } from 'chart.js';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styles: [
  ]
})
export class DoughnutComponent {
  @Input() title:string ="sin titulo"
  @Input('labels') doughnutChartLabels: string[] = ['Label1', 'Label2', 'Label3'];
  @Input('data') doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [350, 450, 100] }
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';
  
  

}
