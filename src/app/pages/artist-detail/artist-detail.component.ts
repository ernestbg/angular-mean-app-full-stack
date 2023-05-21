import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from 'src/app/models/artist.model';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css']
})
export class ArtistDetailComponent {

  constructor(private apiSpotifyService: ApiSpotifyService, private route: ActivatedRoute, private router: Router) { }
  
  artistId: string;
  albums: any[] = [];
  artist: Artist;

  ngOnInit() {
    this.artistId = this.route.snapshot.params['artistId'];
    this.loadArtist(this.artistId);
  }

  loadArtist(id: string) {

    this.apiSpotifyService.getArtist(id).subscribe((artist: any) => {
      this.artist = artist;
      this.loadAlbums(this.artist.name);
    });
  }

  loadAlbums(query: string) {
    this.apiSpotifyService.getAlbums(query).subscribe((albums: any) => {
      console.log(this.albums = albums);
      
    });
  }

  goAlbumDetail(albumId: string) {
    
    this.router.navigate(['/dashboard/album', albumId]);
  }
}


