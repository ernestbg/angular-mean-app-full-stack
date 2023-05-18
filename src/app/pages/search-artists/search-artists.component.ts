import { Component, Output } from '@angular/core';
import { Artist } from 'src/app/models/artists.model';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';


@Component({
  selector: 'app-search-artists',
  templateUrl: './search-artists.component.html',
  styleUrls: ['./search-artists.component.css']
})
export class SearchArtistsComponent {
  public artists: Artist[] = [];

  private _timeWaitSearch: any;

  @Output() searchArtist: any[] = [];
  loading: boolean = false;

  constructor(private _spotifyService: ApiSpotifyService) { }

  search(v: string) {

    clearTimeout(this._timeWaitSearch);

    this._timeWaitSearch = setTimeout(() => {

      this.loading = true;

      this._spotifyService.getArtistas(v).subscribe((data: any) => {
        
        this.artists = data;
        console.log(this.artists)
        
        this.loading = false;

      }, error => {

        error.status == 401 || error.status == 400 && (this._spotifyService.tokenRefreshURL());

      });

    }, 500);

  }
}
