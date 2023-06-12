import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';

@Component({
  selector: 'app-my-albums',
  templateUrl: './my-albums.component.html',
  styleUrls: ['./my-albums.component.css']
})
export class MyAlbumsComponent {

  favouriteAlbum: any;

  constructor(private userService: UserService, private router:Router, private apiSpotifyService: ApiSpotifyService) { }

  ngOnInit(): void {
   
    this.loadfavouriteAlbumsByUser();
  }

  loadfavouriteAlbumsByUser() {
    
    this.userService.getUserById(this.extractTokenId()).subscribe((resp: any) => {
      this.apiSpotifyService.getAlbum(resp.user.favouriteAlbums[0]).subscribe((resp:any)=>{    
        this.favouriteAlbum = resp;
          console.log(this.favouriteAlbum)
      })
    });
  }

  extractTokenId() {
    const token = localStorage.getItem('token')
    const decodedToken: any = jwt_decode(token);
    return decodedToken.uid;
  }

  convertMStoMMSS(ms: string) {
    const milliseconds = parseInt(ms);
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const formattedSeconds = String(seconds).padStart(2, '0');
    return minutes + ":" + formattedSeconds;
  }

  goAlbumDetail(albumId: string) {

    this.router.navigate(['/dashboard/album', albumId]);
  }

  capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
