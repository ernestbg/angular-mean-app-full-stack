import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { User } from '../models/user.model';
import { Playlist } from '../models/playlist.model';
import { Song } from '../models/song.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SearchesService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  private transformUsers(results: any[]): User[] {
    return results.map(user => new User(user.name, user.email, '', user.img, user.role, user.google, user.uid));
  }
  private transformPlaylists(results: any[]): Playlist[] {
    return results;
  }
  private transformSongs(results: any[]): Song[] {
    return results;
  }

  search(type: 'users' | 'playlists' | 'songs', term: string) {
    const url = (`${base_url}/all/collection/${type}/${term}`);
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map((resp: any) => {
          switch (type) {
            case 'users':
              return this.transformUsers(resp.results);
            case 'playlists':
              return this.transformPlaylists(resp.results);
            case 'songs':
              return this.transformSongs(resp.results);
            default:
              return [];
          }
        })
      );
  }

  searchAll(term: string) {
    const url = (`${base_url}/all/${term}`);
    return this.http.get(url, this.headers);
  }
}
