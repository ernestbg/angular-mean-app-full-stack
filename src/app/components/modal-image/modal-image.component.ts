import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [
  ]
})
export class ModalImageComponent {


  public imgUploading: File;
  public imgTemp: any = null;

  constructor(public modalImgService: ModalImgService, private fileUploadService: FileUploadService) { }

  changeImg(file: File): any {
    this.imgTemp = null;
    this.imgUploading = file;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }


  closeModal() {
    this.modalImgService.closeModal();
  }

  uploadImg() {

    const id = this.modalImgService.id;
    const type = this.modalImgService.type;

    this.fileUploadService
      .updateImg(this.imgUploading, type, id)
      .then(img => {
        Swal.fire('Saved', 'Image updated', 'success');
        this.modalImgService.imgUploaded.emit(img);
        this.closeModal();
      })
      .catch(err => {
        Swal.fire('Cannot upload the image', err.error.msg, 'error')
      });
  }

}
