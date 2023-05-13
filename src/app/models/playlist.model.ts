interface _PlaylistUser{
    _id:string;
    name:string;
    img:string;
}

export class Playlist {

    constructor(
        public name: string,
        public _id?: string,
        public img?: string,
        public user?: _PlaylistUser,
    ) { }
}