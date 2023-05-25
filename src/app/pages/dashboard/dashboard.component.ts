import { Component } from '@angular/core';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { Artist } from 'src/app/models/artist.model';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';


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

  constructor(private userService: UserService,
    private apiSpotifyService: ApiSpotifyService,
    private router: Router,
  ) { }



  ngOnInit(): void {

    this.userService.getUserById(this.extractTokenId()).pipe(
      switchMap((resp: any) => this.apiSpotifyService.getArtistAndRelatedArtist(resp.user.favouriteArtist))
    ).subscribe((resp2: any) => {
      this.artists = resp2.artists;
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

}
