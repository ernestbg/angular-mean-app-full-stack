import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CommentService {

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

  loadComments() {
    const url = (`${base_url}/comments`);
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: any) => resp.comments)
      );
  }

  createComment(userId: string, artistId: string, text: string) {
    const url = (`${base_url}/comments`);
    return this.http.post(url, { userId, artistId, text }, this.headers);
  }

  updateComment(_id: string, name: string) {
    const url = (`${base_url}/comments/${_id}`);
    console.log(url);
    return this.http.put(url, { name }, this.headers);
  }

  deleteComment(_id: string) {
    const url = (`${base_url}/comments/${_id}`);
    return this.http.delete(url, this.headers);
  }

}
