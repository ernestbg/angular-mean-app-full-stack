import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async updateImg(file: File, type: 'users' | 'playlists' | 'songs', id: string) {
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
      console.log(resp)
      const data = await resp.json();
      if (data.ok) {
        return data.name
        
      } else {
        console.log(data.msg);
        return false;
      }
    } catch (error) {
      return false;
    }
  }


  async updateSong(file: File, type: 'users' | 'playlists' | 'songs', id: string) {
    try {
      const url = `${base_url}/upload/${type}/${id}`;
      const formData = new FormData();
      formData.append('song', file);
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });
      console.log(resp)
      const data = await resp.json();
      if (data.ok) {
        return data.name
        
      } else {
        console.log(data.msg);
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
