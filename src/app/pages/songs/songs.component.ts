import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Song } from 'src/app/models/song.model';
import { ModalImgService } from 'src/app/services/modal-img.service';
import { ModalSongService } from 'src/app/services/modal-song.service';
import { SearchesService } from 'src/app/services/searches.service';
import { SongService } from 'src/app/services/song.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Storage, ref, listAll, getMetadata, getDownloadURL } from '@angular/fire/storage';
import jwt_decode from 'jwt-decode';
import { CloudService } from 'src/app/services/cloud.service';


@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styles: [
  ]
})
export class SongsComponent implements OnInit, OnDestroy {

  public songs: Song[] = [];
  public loading: boolean = true;
  public imgSubs: Subscription;
  isOpen: boolean;
  firebase = environment.firebase;


  constructor(
    private songService: SongService,
    private modalImgService: ModalImgService,
    private modalSongService: ModalSongService,
    private searchesService: SearchesService,
    private cloudService: CloudService,
    private storage: Storage
  ) { }

  ngOnInit(): void {
    this.loadSongs();
    this.imgSubs = this.modalImgService.imgUploaded.subscribe(img => this.loadSongs());
    this.modalSongService.$modal.subscribe((value) => {
      this.isOpen = value;
    });
    this.getSoundtracks();
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  openModalSong() {
    this.isOpen = true;
  }

  closeModalSong() {
    this.isOpen = false;
  }

  loadSongs() {
    this.loading = true;
    this.songService.loadSongs()
      .subscribe(songs => {
        this.loading = false;
        this.songs = songs;
      });
  }

  openModal(song: Song) {
    this.modalImgService.openModal('songs', song._id, song.img);
  }


  search(term: string) {
    if (term.length === 0) {
      return this.loadSongs();
    }
    this.searchesService.search('songs', term)
      .subscribe(resp => this.songs = resp);
  }

  deleteSong(song: Song) {
    Swal.fire({
      title: 'Are you sure?',
      text: `delete song ${song.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.songService.deleteSong(song._id)
          .subscribe(() => {
            this.loadSongs();
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }
          );
      }
    });
  }


  extractTokenId() {
    const token = localStorage.getItem('token')
    const decodedToken: any = jwt_decode(token);
    return decodedToken.uid;
  }


  getSoundtracks() {
    const songsRef = ref(this.storage, 'soundtracks');
    listAll(songsRef)
      .then(async (result) => {
        const filteredFiles: any = [];
        for (const item of result.items) {
          const metadata = await getMetadata(item);
          if (metadata.customMetadata && metadata.customMetadata['userID'] === this.extractTokenId()) {
            filteredFiles.push(item);
          }
        }
        const urls = await Promise.all(filteredFiles.map((file: any) => getDownloadURL(file)));
        const jsonObjects: any[] = [];

        filteredFiles.forEach((file: any, index: any) => {
          const fileName = file.name;
          const url = urls[index];
          const jsonObject = {
            url: url,
            name: fileName
          };
          jsonObjects.push(jsonObject);
        });
        
       
      })
      .catch((error) => {
        console.error('Error al obtener la lista de archivos:', error);
      });
  }

 

}








