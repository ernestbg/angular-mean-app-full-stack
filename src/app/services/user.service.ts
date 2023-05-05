import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environments';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';


declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }

  public user: User | undefined;

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.user?.uid || '';
  }

  public validateToken(): Observable<boolean> {

    google.accounts.id.initialize({
      client_id:
        '161592380144-mtpedk748esp6229vqt7egmo7p097bkb.apps.googleusercontent.com',
    });


    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { name, email, img, role, google, uid } = resp.user;
        this.user = new User(name, email, '', img, role, google, uid);
        localStorage.setItem('token', resp.token);
        return true;
      }),

      catchError(error => of(false))
    );

  }

  createUser(formData: RegisterForm) {
    return this.http.post(`${base_url}/users`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }



  updateProfile(data: { email: string, name: string, role: string | undefined }) {

    data = {
      ...data,
      role: this.user?.role
    }
    return this.http.put(`${base_url}/users/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    });
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => { localStorage.setItem('token', resp.token); })
      );
  }

  logout() {
    localStorage.removeItem('token');
    google.accounts.id.revoke('ernesto57580@gmail.com', () => {
      this.router.navigateByUrl('/login');
    })
  }
}
