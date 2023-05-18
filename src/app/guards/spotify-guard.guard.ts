import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiSpotifyService } from '../services/api-spotify.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyGuardGuard implements CanActivate {
  constructor(private _SpotifyService: ApiSpotifyService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      this._SpotifyService.checkTokenSpoLogin();
      return this._SpotifyService.checkTokenSpo();

  }
  
}
