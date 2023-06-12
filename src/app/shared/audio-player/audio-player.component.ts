import { Component } from '@angular/core';
import { AudioService } from "../../services/audio.service";
import { CloudService } from "../../services/cloud.service";
import { StreamState } from 'src/app/interfaces/stream-state.interface';
import { SongService } from 'src/app/services/song.service';
import { Storage, ref, listAll, getMetadata, getDownloadURL } from '@angular/fire/storage';
import jwt_decode from 'jwt-decode';
import { ModalSongService } from 'src/app/services/modal-song.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent {


  files: Array<any> = [];
  state: StreamState;
  currentFile: any = {};
  isOpen: boolean;


  constructor(
    public audioService: AudioService,
    public cloudService: CloudService,
    public songService: SongService,
    private storage: Storage,
    private modalSongService: ModalSongService
  ) {
    // get media files
    cloudService.getFiles().subscribe(files => {
      this.files = files;
    });


    // listen to stream state
    this.audioService.getState().subscribe(state => {
      this.state = state;
    });
  }

  ngOnInit(): void {
    this.getSoundtracks();
    this.modalSongService.$modal.subscribe((value) => {
      this.isOpen = value;
    });
  }

  openModalSong() {
    this.isOpen = true;
  }

  closeModalSong() {
    this.isOpen = false;
  }

  getSoundtracks() {
    const songsRef = ref(this.storage, 'soundtracks');
    listAll(songsRef)
      .then(async (result) => {
        const filteredFiles: any = [];
        for (const item of result.items) {
          const metadata = await getMetadata(item);
          if (metadata.customMetadata && metadata.customMetadata['userID'] === this.extractTokenId()) {
            filteredFiles.push(item);
          }
        }
        const urls = await Promise.all(filteredFiles.map((file: any) => getDownloadURL(file)));
        const jsonObjects: any[] = [];

        filteredFiles.forEach((file: any, index: any) => {
          const fileName = file.name;
          const url = urls[index];
          const jsonObject = {
            url: url,
            name: fileName
          };
          jsonObjects.push(jsonObject);
        });
        this.files = jsonObjects;

      })
      .catch((error) => {
        console.error('Error al obtener la lista de archivos:', error);
      });
  }

  extractTokenId() {
    const token = localStorage.getItem('token')
    const decodedToken: any = jwt_decode(token);
    return decodedToken.uid;
  }



  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }


  playStream(url: string) {
    this.audioService.playStream(url).subscribe(events => {
      // listening for fun here
    });
  }

  openFile(file: { url: string; }, index: any) {
    this.currentFile = { index, file };
    this.audioService.stop();
    this.playStream(file.url);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  onSliderChangeEnd(change: any) {
    this.audioService.seekTo(change.value);
  }

}
