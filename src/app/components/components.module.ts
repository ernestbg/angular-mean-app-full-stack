import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ModalImageComponent } from './modal-image/modal-image.component';
import { ModalSongComponent } from './modal-song/modal-song.component';




@NgModule({
  declarations: [ 
    ModalImageComponent,
    ModalSongComponent,  
  ],
  exports: [
    ModalImageComponent,
    ModalSongComponent  
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule
  ]
})
export class ComponentsModule { }
