import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.validateToken()
      .pipe(
        tap(isAuthenticated => {
          if (!isAuthenticated) {
            this.router.navigateByUrl('/login');
          }
        })
      );
  }
}
