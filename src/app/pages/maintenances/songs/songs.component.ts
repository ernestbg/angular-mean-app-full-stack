import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Song } from 'src/app/models/song.model';
import { ModalImgService } from 'src/app/services/modal-img.service';
import { SearchesService } from 'src/app/services/searches.service';
import { SongService } from 'src/app/services/song.service';
import Swal from 'sweetalert2';

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

  constructor(
    private songService: SongService,
    private modalImgService: ModalImgService,
    private searchesService: SearchesService
  ) { }

  ngOnInit(): void {
    this.loadSongs();
    this.imgSubs = this.modalImgService.imgUploaded.subscribe(img => this.loadSongs());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
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
}
