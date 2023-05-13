import { Playlist } from "./playlist.model";

interface _SongUser {
    _id: string;
    name: string;
    img: string;
}

export class Song {

    constructor(
        public name: string,
        public _id?: string,
        public img?: string,
        public user?: _SongUser,
        public playlist?: Playlist,
    ) { }
}