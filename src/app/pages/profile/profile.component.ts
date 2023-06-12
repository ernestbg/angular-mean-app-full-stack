import { Component, OnInit } from '@angular/core';
import { Storage, getDownloadURL, getMetadata, listAll, ref } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import { ModalSongService } from 'src/app/services/modal-song.service';
import { ModalImageService } from 'src/app/services/modal-image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  public user: User | any;
  public imgUploading: File;
  public imgTemp: any = null;
  files: Array<any> = [];
  isOpen: boolean;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private storage: Storage,
    private modalImageService: ModalImageService) {
    this.user = this.userService.user;
  }

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]]

    });
    this.modalImageService.$modal.subscribe((value) => {
      this.isOpen = value;
    });

    this.getImages();
  }

  updateProfile() {
    console.log(this.profileForm!.value);
    this.userService.updateProfile(this.profileForm.value)
      .subscribe(() => {
        const { name, email } = this.profileForm.value;
        this.user.name = name;
        this.user.email = email;
        Swal.fire('Saved', 'Changes saved', 'success');
      }, (err) => {
        Swal.fire('Email already exist', err.error.msg, 'error');
      });
  }

  // changeImg(file: File): any {
  //   this.imgUploading = file;

  //   if (!file) {
  //     return this.imgTemp = null;
  //   }

  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     this.imgTemp = reader.result;
  //   }
  // }

  // uploadImg() {
  //   this.fileUploadService
  //     .updateImg(this.imgUploading, 'users', this.user.uid)
  //     .then(img => this.user.img = img);
  //   Swal.fire('Saved', 'Image updated', 'success')
  //     .catch(err => {
  //       Swal.fire('Cannot upload the image', err.error.msg, 'error')
  //     });
  // }

  getImages() {
    const imagesRef = ref(this.storage, 'images');
    listAll(imagesRef)
      .then(async (result) => {
        const filteredFiles: any = [];
        for (const item of result.items) {
          const metadata = await getMetadata(item);
          if (metadata.customMetadata && metadata.customMetadata['userID'] === this.extractTokenId()) {
            filteredFiles.push(item);
          }
        }
        const urls = await Promise.all(filteredFiles.map((file: any) => getDownloadURL(file)));
        const jsonObjects: any[] = [];
        filteredFiles.forEach((file: any, index: any) => {
          const fileName = file.name;
          const url = urls[index];
          const jsonObject = {
            url: url,
            name: fileName
          };
          jsonObjects.push(jsonObject);
        });
        this.files = jsonObjects;
        console.log()
      })
      .catch((error) => {
        console.error('Error al obtener la lista de archivos:', error);
      });
  }

  extractTokenId() {
    const token = localStorage.getItem('token')
    const decodedToken: any = jwt_decode(token);
    return decodedToken.uid;
  }

  openModalImage() {
    this.isOpen = true;
  }

  closeModalImage() {
    this.isOpen = false;
  }

}
