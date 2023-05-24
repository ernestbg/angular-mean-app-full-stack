import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiSpotifyService } from 'src/app/services/api-spotify.service';
import jwt_decode from 'jwt-decode';
import { CommentService } from 'src/app/services/comment.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';



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
  ) { }

  albumId: string;
  album: any;
  review: string;
  items: any[];
  artistId: string;
  comments: any;
  favouriteArtists: any[];

  ngOnInit() {
    this.albumId = this.route.snapshot.params['albumId'];
    this.loadAlbum(this.albumId);
    this.loadComments();

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

  createComment() {
    this.commentService.createComment(this.extractTokenId(), this.artistId, this.review).subscribe((resp: any) => {
      Swal.fire('Published', `Comment published`, 'success');
      //this.router.navigateByUrl(`/dashboard/album/${this.albumId}`);
    });;
    this.updateFavouriteArtists(this.artistId)
  }


  loadAlbum(id: string) {
    this.apiSpotifyService.getAlbum(id).subscribe((album: any) => {
      this.album = album;
      this.items = album.tracks.items;
      this.artistId = album.artists[0].id;
    });
  }

  loadComments() {
    this.commentService.loadComments().subscribe((comments: any) => {
      this.comments = comments;
      console.log(this.comments)
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
    })
  }

}
