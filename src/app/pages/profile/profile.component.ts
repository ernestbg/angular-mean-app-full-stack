import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  public user: User | any;
  public imgUploading: File;
  public imgTemp: any = null;

  constructor(private fb: FormBuilder, private userService: UserService, private fileUploadService: FileUploadService) {
    this.user = this.userService.user;
  }

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]]

    });
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

  changeImg(file: File): any {
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

  uploadImg() {
    this.fileUploadService
      .updateImg(this.imgUploading, 'users', this.user.uid)
      .then(img => this.user.img = img);
    Swal.fire('Saved', 'Image updated', 'success')
      .catch(err => {
        Swal.fire('Cannot upload the image', err.error.msg, 'error')
      });
  }

}
