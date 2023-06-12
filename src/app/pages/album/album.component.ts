import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';
import jwt_decode from 'jwt-decode';
import { CommentService } from 'src/app/services/comment.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es, th } from 'date-fns/locale';




@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent {

  constructor(private apiSpotifyService: ApiSpotifyService,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {

  }

  albumId: string;
  album: any;
  review: string;
  items: any[];
  artistId: string;
  comments: any[];
  favouriteArtists: any[];
  favouriteAlbums: any[];
  tiempoTranscurrido: any;
  isClicked: boolean = false;
  @ViewChild('icon') icon: ElementRef;
  storedClass: string;


  ngOnInit() {
    this.albumId = this.route.snapshot.params['albumId'];
    this.loadAlbum(this.albumId);
    this.loadComments();
    this.checkFavouriteAlbums();

    this.storedClass = localStorage.getItem('iconClass');

  }

  checkFavouriteAlbums() {
   
    this.userService.getUserById(this.extractTokenId()).subscribe((data: any) => {
      
      if (data.user.favouriteAlbums[0].includes(this.albumId)) {
        this.storedClass = 'mdi mdi-heart heart-icon';
        localStorage.setItem('iconClass', this.storedClass);
      } else {
        this.storedClass = 'mdi mdi-heart-outline heart-icon';
        localStorage.setItem('iconClass', this.storedClass);
      }
    })

  }

  updateFavouriteAlbums() {
    this.isClicked = !this.isClicked;
    const heartIcon = this.icon.nativeElement as HTMLElement;
    if (this.isClicked) {
      this.storedClass = 'mdi mdi-heart heart-icon';
      this.userService.addFavouriteAlbums(this.albumId).subscribe((resp) => {
        console.log(resp)
      });
    } else {
      this.storedClass = 'mdi mdi-heart-outline heart-icon';
      this.userService.deleteFavouriteAlbum(this.albumId).subscribe((resp) => {
        console.log(resp)
      });
    }
   


  }

  extractTokenId() {
    const token = localStorage.getItem('token')
    const decodedToken: any = jwt_decode(token);
    return decodedToken.uid;
  }

  submitReview() {
    this.createComment();
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
        if (analysis <= -4) {
          console.log('la opinion es censurable');
        };
        if (analysis < 0) {
          console.log('la opinion es mala');
          this.userService.deleteFavouriteArtists();
        };
        if (analysis === 0) {
          console.log('la opinion es neutra');
        }
        if (analysis > 0) {
          console.log('la opinion es buena');
          this.updateFavouriteArtists(this.artistId);
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  createComment() {
    this.commentService.createComment(this.extractTokenId(), this.artistId, this.albumId, this.review).subscribe((resp: any) => {
      Swal.fire('Published', `Comment published`, 'success');
      //this.router.navigateByUrl(`/dashboard/album/${this.albumId}`);
    });
  }


  loadAlbum(id: string) {
    this.apiSpotifyService.getAlbum(id).subscribe((album: any) => {
      this.album = album;
      this.items = album.tracks.items;
      this.artistId = album.artists[0].id;
    });
  }

  loadComments() {
    this.commentService.loadComments(this.albumId).subscribe((comments: any) => {
      this.comments = comments;
    })
  }

  convertMStoMMSS(ms: string) {
    const milliseconds = parseInt(ms);
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const formattedSeconds = String(seconds).padStart(2, '0');
    return minutes + ":" + formattedSeconds;
  }

  updateFavouriteArtists(artistId: string) {
    return this.userService.updateFavouriteArtists(artistId).subscribe((resp: any) => {
      console.log(resp)
    });
  }




  conditionalClassIcon() {

    const heartIcon = this.icon.nativeElement as HTMLElement;
    this.userService.getUserById(this.extractTokenId()).subscribe((user: any) => {

      if (user.favouriteAlbums.includes(this.albumId)) {
        // El array contiene el string, conservar la clase
        heartIcon.classList.add('mdi mdi-heart heart-icon');
      } else {
        // El array no contiene el string, cambiar la clase
        heartIcon.classList.remove('mdi mdi-heart heart-icon');
        heartIcon.classList.add('mdi mdi-heart-outline heart-icon');
      }
    })

  }



  getTiempoTranscurrido(timestamp: string) {
    const parsedTimestamp = parseISO(timestamp);

    return formatDistanceToNow(parsedTimestamp, { locale: es }) + ' ago';
  }

}
