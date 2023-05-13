import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environments';
import { Song } from '../models/song.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SongService {

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

  loadSongs() {
    const url = (`${base_url}/songs`);
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: any) => resp.songs)
      );
  }
  
  loadSongById(id: string) {
    const url = `${base_url}/songs/${id}`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: any) => resp.song)
      );
  }

  createSong(song: { name: string, playlist: string }) {
    const url = (`${base_url}/songs`);
    return this.http.post(url, song, this.headers);
  }

  updateSong(song: Song) {
    const url = (`${base_url}/songs/${song._id}`);
    console.log(url);
    return this.http.put(url, song, this.headers);
  }

  deleteSong(_id: string) {
    const url = (`${base_url}/songs/${_id}`);
    return this.http.delete(url, this.headers);
  }
}
