import { Component } from '@angular/core';
import { ModalSongService } from 'src/app/services/modal-song.service';
import { Storage, ref, uploadBytes, listAll, getDownloadURL, updateMetadata, getMetadata } from '@angular/fire/storage';
import jwt_decode from 'jwt-decode';



@Component({
  selector: 'app-modal-song',
  templateUrl: './modal-song.component.html',
  styleUrls: ['./modal-song.component.css']
})



export class ModalSongComponent {

  constructor(private modalSongService: ModalSongService,
    private storage: Storage
  ) { }

  ngOnInit(): void {

  }

  closeModal() {
    this.modalSongService.$modal.emit(false)
  }




  extractTokenId() {
    const token = localStorage.getItem('token')
    const decodedToken: any = jwt_decode(token);
    return decodedToken.uid;
  }


  uploadFile($event: any) {
    const file = $event.target.files[0];

    const storageRef = ref(this.storage, `soundtracks/${file.name}`);

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









