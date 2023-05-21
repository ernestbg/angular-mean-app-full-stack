import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';
import jwt_decode from 'jwt-decode';



@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent {

  constructor(private apiSpotifyService: ApiSpotifyService, private router: Router, private route: ActivatedRoute) { }

  albumId: string;
  album: any;
  review: string;
  items: any[];

  ngOnInit() {
    this.albumId = this.route.snapshot.params['albumId'];
    this.loadAlbum(this.albumId);
  }

  extractTokenId() {
    const token = localStorage.getItem('token')
    const decodedToken: any = jwt_decode(token);
  }

  submitReview() {

    const options = {
      method: 'POST',
      body: JSON.stringify({ review: this.review }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch('http://localhost:3000/api/nlp/s-analyzer', options)
      .then(res => res.json())
      .then(({ analysis }) => {
        if (analysis < 0) {
          console.log('tu respuesta es mala')
        };
        if (analysis === 0) {
          console.log('tu respuesta es neutra')
        }
        if (analysis > 0) {
          console.log('tu respuesta es buena')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }


  loadAlbum(id: string) {
    this.apiSpotifyService.getAlbum(id).subscribe((album: any) => {
      this.album = album;
      this.items = album.tracks.items;
    });
  }

  convertMStoMMSS(ms: string) {
    const milliseconds = parseInt(ms);

    // Convertir milisegundos a minutos
    const minutes = Math.floor(milliseconds / 60000);

    // Convertir milisegundos restantes a segundos
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    const formattedSeconds = String(seconds).padStart(2, '0');

    return minutes + ":" + formattedSeconds;
  }

}
