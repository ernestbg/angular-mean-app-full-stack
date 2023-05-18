import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Artist } from '../models/artists.model';


@Injectable({
  providedIn: 'root'
})

export class ApiSpotifyService {


  

  public credentials = {

    clientId: 'f4dc070581764a72972509546136585d',
    clientSecret: '06e92990cc824a82b108949e3a04ffa1',
    accessToken: ''
  };

  public poolURlS = {

    authorize: 'https://accounts.spotify.com/es-ES/authorize?client_id=' +
      this.credentials.clientId + '&response_type=token' +
      '&redirect_uri=' + encodeURIComponent('http://localhost:4200/dashboard') +
      '&expires_in=3600',
    refreshAccessToken: 'https://accounts.spotify.com/api/token'


  };

  constructor(private _httpClient: HttpClient) {

    this.upDateToken();


  }

  newToken = ''

  token = fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(this.credentials.clientId + ':' + this.credentials.clientSecret) // Reemplaza clientId y clientSecret con tus propias credenciales
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',

    })
  })
    .then(response => response.json())
    .then(data => {
      // Aquí puedes manejar la respuesta y obtener el nuevo token de acceso renovado
      this.newToken = this.credentials.accessToken = data.access_token;

    })
    .catch(error => {
      // Manejo de errores
      console.error(error);
    });

  upDateToken() {
    this.credentials.accessToken = sessionStorage.getItem('token') || '';

  }



  getInfo(query: string) {

    this.upDateToken();

    const URL = `https://api.spotify.com/v1/${query}`;
    const HEADER = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.newToken }) };
    console.log(this.credentials.accessToken)

    return this._httpClient.get(URL, HEADER);

  }

  checkTokenSpoLogin() {
    console.log('checkTokenSpoLogin')
    this.checkTokenSpo() || (sessionStorage.setItem('refererURL', location.href), window.location.href = this.poolURlS.authorize);

  }

  checkTokenSpo() {

    return !!this.credentials.accessToken;

  }

  tokenRefreshURL() {

    this.checkTokenSpo() && alert('Expiro la sesión');

    this.credentials.accessToken = '';
    sessionStorage.removeItem('token');
    this.checkTokenSpoLogin();

  }

  getNewReleases() {

    return this.getInfo('browse/new-releases?limit=50&offset=0').pipe(map((data: any) => data.albums.items));

  }

  getArtistas(v: string) {

    return this.getInfo(`search?q=${v}&type=artist`).pipe(map((data: any) => data.artists.items));

  }

  getArtista(v: string) {

    return this.getInfo(`artists/${v}`);

  }

  getTopTracks(v: string) {

    return this.getInfo(`artists/${v}/top-tracks?country=us`);

  }

}
