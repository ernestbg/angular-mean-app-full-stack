import { Injectable } from "@angular/core";
import { Subject, of } from "rxjs";
import { Storage, ref, listAll, getMetadata, getDownloadURL } from '@angular/fire/storage';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: "root"
})
export class CloudService {


  files: any = []

  constructor(private storage: Storage) { }

  extractTokenId() {
    const token = localStorage.getItem('token')
    const decodedToken: any = jwt_decode(token);
    return decodedToken.uid;
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
       this.files=jsonObjects;
      })
      .catch((error) => {
        console.error('Error al obtener la lista de archivos:', error);
      });
  }



 

  //   {
  //     url:
  //       "https://firebasestorage.googleapis.com/v0/b/app-mean-audio-player.appspot.com/o/soundtracks%2FNick%20Curly%20-%20Underground%20(Dennis%20Ferrer%20Remix)%20(320%20kbps).mp3?alt=media&token=9241a02d-33cc-43db-b2a0-b3bbfaaaa23b",
  //     name: "Perfect",
  //     artist: " Ed Sheeran"
  //   },
  //   {

  //     url:
  //       "https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3",
  //     name: "Man Atkeya Beparwah",
  //     artist: "Nusrat Fateh Ali Khan"
  //   },
  //   {
  //     url:
  //       "https://ia801503.us.archive.org/15/items/TheBeatlesPennyLane_201805/The%20Beatles%20-%20Penny%20Lane.mp3",
  //     name: "Penny Lane",
  //     artist: "The Beatles"
  //   }
  // ];

  getFiles() {
    console.log(this.files)
    return of(this.files);
  }
}