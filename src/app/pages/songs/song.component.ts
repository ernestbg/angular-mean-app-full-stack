import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { Playlist } from 'src/app/models/playlist.model';
import { Song } from 'src/app/models/song.model';
import { PlaylistService } from 'src/app/services/playlist.service';
import { SongService } from 'src/app/services/song.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styles: [
  ]
})
export class SongComponent implements OnInit {

  public songForm: FormGroup;
  public playlists: Playlist[] = [];
  public playlistSelected: Playlist;
  public songSelected: Song;


  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private songService: SongService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .subscribe(({ id }) => this.loadSong(id));

    this.songForm = this.fb.group({
      name: ['', Validators.required],
      playlist: ['', Validators.required]
    });
    this.loadPlaylists();
    this.songForm.get('playlist').valueChanges
      .subscribe(idPlaylist => {
        this.playlistSelected = this.playlists.find(p => p._id === idPlaylist)
      });
  }

  loadSong(id: string) {
    if (id === 'new') {
      return
    }
    this.songService.loadSongById(id)
      .pipe(
        delay(100)
      )
      .subscribe(song => {
        if (!song) {
          return this.router.navigateByUrl(`/dashboard/song/`)
        }
        const { name, playlist: { _id } } = song;
        this.songSelected = song;
        this.songForm.setValue({ name, playlist: _id });
      });
  }

  loadPlaylists() {
    this.playlistService.loadPlaylists()
      .subscribe((playlists: Playlist[]) => {
        this.playlists = playlists;
      });
  }

  saveSong() {
    const { name } = this.songForm.value;

    if (this.songSelected) {
      const data = {
        ...this.songForm.value,
        _id: this.songSelected._id
      }
      this.songService.updateSong(data)
        .subscribe(resp =>
          Swal.fire('Updated', `${name} updated`, 'success')
        );
    } else {
      this.songService.createSong(this.songForm.value)
        .subscribe((resp: any) => {
          Swal.fire('Saved', `${name} saved`, 'success');
          this.router.navigateByUrl(`/dashboard/song/${resp.song._id}`)
        });
    }
  }
}
