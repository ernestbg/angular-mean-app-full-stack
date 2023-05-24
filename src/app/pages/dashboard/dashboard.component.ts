import { Component } from '@angular/core';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { Artist } from 'src/app/models/artist.model';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'
  ]
})

export class DashboardComponent {


  artistsname: string;
  artistid: string;

  artists: any[];


  contador: number = 0;




  constructor(private userService: UserService, private apiSpotifyService: ApiSpotifyService, private router: Router) { }



  ngOnInit(): void {
    this.apiSpotifyService.getArtistAndRelatedArtist('4rXABp4A7KjG9elWFNAbO4').subscribe((resp: any) => {

      this.artists = resp.artists;
      console.log(this.artists)

    });
  }



  getFavouriteArtist() {
    this.userService.getUserById(this.extractTokenId()).subscribe((resp: any) => {
      this.artistid = resp.user.favouriteArtist;
      return this.artistid

    });
  }

  extractTokenId() {
    const token = localStorage.getItem('token')
    const decodedToken: any = jwt_decode(token);
    return decodedToken.uid;
  }

  capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  goArtistDetail(artistId: string) {
    this.router.navigate(['/dashboard/artist-detail', artistId]);
  }

  /////////////////////////////////////////////////
  searchArtists(query: string) {
    this.apiSpotifyService.getArtists(query).subscribe((data: any) => {
      this.artists = data;

    });
  }

}
