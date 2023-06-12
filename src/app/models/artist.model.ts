interface Image{
   url:string;
   
}

export class Artist {

    constructor(
        public id: string,
        public type: string,
        public name: string,
        public images?: Image[],
        public followers?: any,

    ) { }
}