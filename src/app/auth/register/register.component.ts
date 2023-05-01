import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['1234', Validators.required],
    confirmPassword: ['1234', Validators.required],
    terms: [false, Validators.required]
  }, { validators: this.equalPasswords('password', 'confirmPassword') });

  constructor(private fb: FormBuilder, private userService: UserService, private router:Router) { }

  createUser() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);
    if (this.registerForm.invalid) {
      return;
    }

    this.userService.createUser(this.registerForm.value)
      .subscribe(resp => {
        this.router.navigateByUrl('/');
      }, err => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  fieldNotValid(field: string): boolean {
    return this.registerForm.get(field)?.invalid && this.formSubmitted ? true : false;
  }

  validatePasswords() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password !== confirmPassword ? true : false;
  }

  acceptTerms() {
    return !this.registerForm.get('terms')?.value && this.formSubmitted;
  }

  equalPasswords(password: string, confirmPassword: string) {

    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (passwordControl?.value === confirmPasswordControl?.value) {
        confirmPasswordControl?.setErrors(null);
      } else {
        confirmPasswordControl?.setErrors({ notEqual: true });
      }
    }
  }
}
