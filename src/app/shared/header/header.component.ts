import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Artist } from 'src/app/models/artist.model';
import { User } from 'src/app/models/user.model';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public user: User | undefined;
  artists: Artist[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private apiSpotifyService: ApiSpotifyService,
  ) {
    this.user = userService.user;
  }

  search(term: string) {
    if (term.length === 0) {
      this.router.navigateByUrl('/dashboard');
    }
    this.router.navigateByUrl(`/dashboard/search/${term}`);
  }

  logout() {
    this.userService.logout();
  }

  /////////////////////////////
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
