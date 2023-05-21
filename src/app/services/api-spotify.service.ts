import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Artist } from '../models/artist.model';


@Injectable({
  providedIn: 'root'
})

export class ApiSpotifyService {

  public credentials = {
    clientId: 'f4dc070581764a72972509546136585d',
    clientSecret: '06e92990cc824a82b108949e3a04ffa1',
  };

  public poolURlS = {

    authorize: 'https://accounts.spotify.com/es-ES/authorize?client_id=' +
      this.credentials.clientId + '&response_type=token' +
      '&redirect_uri=' + encodeURIComponent('http://localhost:4200/dashboard') +
      '&expires_in=3600',
  };

  constructor(private _httpClient: HttpClient) {}

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
      this.newToken = data.access_token;
    })
    .catch(error => {
      console.error(error);
    });

  getInfo(query: string) {

    const URL = `https://api.spotify.com/v1/${query}`;
    const HEADER = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.newToken }) };

    return this._httpClient.get(URL, HEADER);
  }

  getNewReleases() {
    return this.getInfo('browse/new-releases?limit=50&offset=0').pipe(map((data: any) => data.albums.items));
  }

  getArtists(query: string) {
    return this.getInfo(`search?q=${query}&type=artist&limit=8`).pipe(map((data: any) => data.artists.items));
  }

  getArtist(id: string) {
    return this.getInfo(`artists/${id}`);
  }

  getAlbums(query: string) {
    return this.getInfo(`search?q=${query}&type=album&limit=8`).pipe(map((data: any) => data.albums.items));
  }

  getAlbum(id: string) {
    return this.getInfo(`albums/${id}`);
  }

  getTopTracks(v: string) {
    return this.getInfo(`artists/${v}/top-tracks?country=us`);
  }

}
