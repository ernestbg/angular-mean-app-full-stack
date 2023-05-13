import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environments';
import { Playlist } from '../models/playlist.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  loadPlaylists() {
    const url = (`${base_url}/playlists`);
    return this.http.get(url, this.headers)
      .pipe(
        map( (resp: any) => resp.playlists)
      );
  }

  createPlaylist(name:string) {
    const url = (`${base_url}/playlists`);
    return this.http.post(url, {name}, this.headers);   
  }

  updatePlaylist( _id:string, name:string) {
    const url = (`${base_url}/playlists/${_id}`);
    console.log(url);
    return this.http.put(url, {name}, this.headers);   
  }

  deletePlaylist( _id:string) {
    const url = (`${base_url}/playlists/${_id}`);
    return this.http.delete(url, this.headers);  
  }
}
