import { Component } from '@angular/core';
import { ChartData, ChartEvent, ChartType, Color } from 'chart.js';

@Component({
  selector: 'app-graphic1',
  templateUrl: './graphic1.component.html',
  styles: [
  ]
})
export class Graphic1Component {
 

public labels1:string[]=['Producto1','Producto2','Producto3']
public data = [
  [350, 450, 100]
]
  
};


