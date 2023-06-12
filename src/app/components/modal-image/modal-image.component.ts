import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import Swal from 'sweetalert2';
import { Storage, ref, uploadBytes, listAll, getDownloadURL, updateMetadata, getMetadata } from '@angular/fire/storage';
import jwt_decode from 'jwt-decode';
import { ModalImageService } from 'src/app/services/modal-image.service';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [
  ]
})
export class ModalImageComponent {


  public imgUploading: File;
  public imgTemp: any = null;
  isOpen: boolean;

  constructor(public modalImgService: ModalImgService,
    public modalImageService: ModalImageService,
    private fileUploadService: FileUploadService,
    private storage: Storage) { }

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
  openModalImage() {
    this.isOpen = true;
  }


  closeModal() {
    this.modalImageService.$modal.emit(false)
  }

  extractTokenId() {
    const token = localStorage.getItem('token')
    const decodedToken: any = jwt_decode(token);
    return decodedToken.uid;
  }

  // uploadImg() {

  //   const id = this.modalImgService.id;
  //   const type = this.modalImgService.type;

  //   this.fileUploadService
  //     .updateImg(this.imgUploading, type, id)
  //     .then(img => {
  //       Swal.fire('Saved', 'Image updated', 'success');
  //       this.modalImgService.imgUploaded.emit(img);
  //       this.closeModal();
  //     })
  //     .catch(err => {
  //       Swal.fire('Cannot upload the image', err.error.msg, 'error')
  //     });
  // }


  uploadFile($event: any) {
    const file = $event.target.files[0];

    const storageRef = ref(this.storage, `images/${file.name}`);

    // Sube el archivo a Firebase Storage
    uploadBytes(storageRef, file)
      .then(() => {
        // Obtiene los metadatos actuales del archivo recién subido
        return getMetadata(storageRef);
      })
      .then((metadata) => {
        // Asigna los metadatos personalizados al archivo
        const userID = this.extractTokenId(); // ID del usuario en particular

        // Verifica si los metadatos personalizados ya existen
        const customMetadata = metadata.customMetadata || {};

        // Actualiza los metadatos personalizados con el ID de usuario
        const updatedMetadata = {
          ...metadata,
          customMetadata: {
            ...customMetadata,
            userID: userID
          }
        };
        return updateMetadata(storageRef, updatedMetadata);
      })
      .then((updatedMetadata) => {
        console.log(updatedMetadata);
        // El archivo se ha subido exitosamente y los metadatos personalizados se han asociado
      })
      .catch((error) => {
        // Ocurrió un error durante la carga del archivo
        console.error(error);
      });
  }

}
