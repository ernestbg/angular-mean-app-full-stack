import { Component } from '@angular/core';
import { AudioService } from "../../services/audio.service";
import { CloudService } from "../../services/cloud.service";
import { StreamState } from 'src/app/interfaces/stream-state.interface';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent {


  files: Array<any> = [];
  state: StreamState;
  currentFile: any = {};

  constructor(
    public audioService: AudioService,
    public cloudService: CloudService,
    public songService: SongService,
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

  onSliderChangeEnd(change:any) {
    this.audioService.seekTo(change.value);
  }

}
