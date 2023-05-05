import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async updateImg(file: File, type: 'users' | 'playlists', id: string) {

    try {
      const url = `${base_url}/upload/${type}/${id}`;
      const formData = new FormData();
      formData.append('img', file);
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });
      const data = await resp.json();
      if (data.ok) {
        data.name
      } else {
        return false;
      }

    } catch (error) {
      return false;
    }
  }
}
