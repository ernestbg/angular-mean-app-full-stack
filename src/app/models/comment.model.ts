

export class Comment {

    constructor(
        public userId: string,
        public _id: string,
        public artistId: string,
        public albumId: string,
        public text: string,
    ) { }
}