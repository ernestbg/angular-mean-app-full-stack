import { Component } from '@angular/core';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'
  ]
})

export class DashboardComponent {

  artistsname: string;
  artistid: string;
  artists: any[]=[];
  newReleases: any[];

  constructor(private userService: UserService,
    private apiSpotifyService: ApiSpotifyService,
    private router: Router,
    private _httpClient: HttpClient) { }



  ngOnInit(): void {

    this.userService.getUserById(this.extractTokenId()).pipe(
      switchMap((resp: any) => this.apiSpotifyService.getArtistAndRelatedArtist(resp.user.favouriteArtist))
    ).subscribe((resp2: any) => {
      this.artists = resp2.artists;
    });



    this.getNewReleases();


  }

  getFavouriteArtist() {
    this.userService.getUserById(this.extractTokenId()).subscribe((resp: any) => {
      this.artistid = resp.user.favouriteArtist;
      return this.artistid;
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
  goAlbumDetail(albumId: string) {

    this.router.navigate(['/dashboard/album', albumId]);
  }

  getNewReleases() {

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',

      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': 'f4dc070581764a72972509546136585d',
        'client_secret': '06e92990cc824a82b108949e3a04ffa1'

      })
    }).then(response => response.json())
      .then(data => {

        const URL = `https://api.spotify.com/v1/browse/new-releases`;
        const HEADER = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + data.access_token }) };

        return this._httpClient.get(URL, HEADER).subscribe((resp: any) => this.newReleases = resp.albums.items);
      })




  }
}
