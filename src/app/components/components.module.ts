import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncrementerComponent } from './incrementer/incrementer.component';
import { FormsModule } from '@angular/forms';
import { DoughnutComponent } from './doughnut/doughnut.component';
import { NgChartsModule } from 'ng2-charts';
import { ModalImageComponent } from './modal-image/modal-image.component';




@NgModule({
  declarations: [
    IncrementerComponent,
    DoughnutComponent,
    ModalImageComponent,
    
  ],
  exports: [
    IncrementerComponent,
    DoughnutComponent,
    ModalImageComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule
  ]
})
export class ComponentsModule { }
