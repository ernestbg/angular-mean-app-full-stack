import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Playlist } from 'src/app/models/playlist.model';
import { ModalImgService } from 'src/app/services/modal-img.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { SearchesService } from 'src/app/services/searches.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styles: [
  ]
})
export class PlaylistsComponent implements OnInit {

  public playlists: Playlist[] = [];
  public loading: boolean = true;
  public imgSubs: Subscription;

  constructor(
    private playlistService: PlaylistService,
    private modalImgService: ModalImgService,
    private searchesService: SearchesService
  ) { }

  ngOnInit(): void {
    this.loadPlaylists();
    this.imgSubs = this.modalImgService.imgUploaded.subscribe(img => this.loadPlaylists());

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  loadPlaylists() {
    this.loading = true;
    this.playlistService.loadPlaylists()
      .subscribe(playlists => {
        this.loading = false;
        this.playlists = playlists;
      });
  }

  saveChanges(playlist: Playlist) {
    this.playlistService.updatePlaylist(playlist._id, playlist.name)
      .subscribe(() => {
        Swal.fire('Updated', playlist.name, 'success')
      });
  }

  deletePlaylist(playlist: Playlist) {
    this.playlistService.deletePlaylist(playlist._id)
      .subscribe(() => {
        this.loadPlaylists();
        Swal.fire('Deleted', playlist.name, 'success')
      });
  }

  async openModalPlaylistName() {
    const { value } = await Swal.fire<string>({
      title: 'CreatePlaylist',
      text: 'Name for playlist',
      input: 'text',
      inputPlaceholder: 'Enter the URL',
      showCancelButton: true
    });

    if (value.trim().length > 0) {
      this.playlistService.createPlaylist(value)
        .subscribe((resp: any) => this.playlists.push(resp.playlist));
    }
  }

  openModal(playlist: Playlist) {
    this.modalImgService.openModal('playlists', playlist._id, playlist.img);
  }

  search(term: string) {
    if (term.length === 0) {
      return this.loadPlaylists();
    }
    this.searchesService.search('playlists', term)
      .subscribe(resp => this.playlists = resp);
  }
}
