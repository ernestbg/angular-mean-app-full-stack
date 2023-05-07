import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImgService {

  private _hideModal: boolean = true;
  public type: 'users' | 'playlists' | 'songs';
  public id: string;
  public img: string;
  public imgUploaded: EventEmitter<string> = new EventEmitter<string>();

  get hideModal() {
    return this._hideModal;
  }

  constructor() { }

  openModal(type: 'users' | 'playlists' | 'songs', id: string, img: string = 'no-img') {
    this._hideModal = false;
    this.type = type;
    this.id = id;

    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${type}/${img}`
    }
  }

  closeModal() {
    this._hideModal = true;
  }
}
