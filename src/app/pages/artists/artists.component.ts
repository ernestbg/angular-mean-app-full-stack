import { Component, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Artist } from 'src/app/models/artist.model';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artists.component.html',
  styleUrls: [
    './artists.component.css'
  ]
})
export class ArtistsComponent {

  artists: Artist[] = [];

  constructor(private apiSpotifyService: ApiSpotifyService, private router: Router) { }

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
