import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from 'src/app/models/artist.model';
import { Playlist } from 'src/app/models/playlist.model';
import { Song } from 'src/app/models/song.model';
import { User } from 'src/app/models/user.model';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';
import { SearchesService } from 'src/app/services/searches.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})
export class SearchComponent implements OnInit {

  public users: User[] = [];
  public playlists: Playlist[] = [];
  public songs: Song[] = [];
  public loading: boolean = true;
  artists: Artist[] = [];

  constructor(private activateRoute: ActivatedRoute,
    private searchesService: SearchesService,
    private apiSpotifyService: ApiSpotifyService,
    private router: Router) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(
      ({ term }) => {
        this.searchAll(term);
        this.searchArtists(term);
      }
    )
  }

  searchAll(term: string) {
    this.loading = true;
    this.searchesService.searchAll(term)
      .subscribe((resp: any) => {
        this.loading = false;
        this.users = resp.users;
        this.playlists = resp.playlists;
        this.songs = resp.songs;
      });
  }


  //////////////////////////////////

  searchArtists(query: string) {
    this.apiSpotifyService.getArtists(query).subscribe((data: any) => {
      this.artists = data;

    });
  }

  capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  goArtistDetail(artistId: string) {
    this.router.navigate(['/dashboard/artist-detail', artistId]);
  }



}
