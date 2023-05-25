import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { LoadUser } from '../interfaces/load-users.interface';


declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }

  public user: User;
  public favouriteArtist: string;

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.user?.uid || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.user.role;
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  saveLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  getUserById(id: any){
    const url = (`${base_url}/users/${id}`);
    return this.http.get(url, this.headers);

  }

  public validateToken(): Observable<boolean> {
    google.accounts.id.initialize({
      client_id:
        '161592380144-mtpedk748esp6229vqt7egmo7p097bkb.apps.googleusercontent.com',
    });
    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map((resp: any) => {
        const { name, email, img, role, google, uid } = resp.user;
        this.user = new User(name, email, '', img, role, google, uid);
        this.saveLocalStorage(resp.token, resp.menu);
        return true;
      }),
      catchError(error => of(false))
    );
  }

  createUser(formData: RegisterForm) {
    return this.http.post(`${base_url}/users`, formData)
      .pipe(
        tap((resp: any) => {
          this.saveLocalStorage(resp.token, resp.menu);
        })
      );
  }

  updateProfile(data: { email: string, name: string, role: string }) {
    data = {
      ...data,
      role: this.user.role,
    }
    return this.http.put(`${base_url}/users/${this.uid}`, data, this.headers);
  }

  updateFavouriteArtists(artistId: string) {
    const options={
      favouriteArtist:artistId
    }
    return this.http.put(`${base_url}/users/favourite-artists/${this.uid}`, options, this.headers);
    
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          this.saveLocalStorage(resp.token, resp.menu);
          localStorage.setItem('uid', resp.uid);
        })
      );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          this.saveLocalStorage(resp.token, resp.menu);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    google.accounts.id.revoke(this.user.email, () => {
      this.router.navigateByUrl('/login');
    });
    this.router.navigateByUrl('/login');
  }

  loadUsers(from: number = 0) {
    const url = (`${base_url}/users?from=${from}`);
    return this.http.get<LoadUser>(url, this.headers)
      .pipe(
        map(resp => {
          const users = resp.users.map(
            user => new User(user.name, user.email, null, user.img, user.role, user.google, user.uid)
          );
          return {
            total: resp.total,
            users
          };
        })
      );
  }

  saveUser(user: User) {
    return this.http.put(`${base_url}/users/${user.uid}`, user, this.headers);
  }

  deleteUser(user: User) {
    const url = (`${base_url}/users/${user.uid}`);
    return this.http.delete(url, this.headers)
  }
}
