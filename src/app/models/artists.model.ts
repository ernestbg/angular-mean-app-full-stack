interface Image{
   url:string;
   
}

export class Artist {

    constructor(
        public name: string,
        public _id?: string,
        public images?: Image[],
    ) { }
}