import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  menu: any[] = [
    {
      title: 'Home',
      icon:'mdi mdi-gauge',
      submenu:[
        {title:'Main', url:'/'},
        {title:'ProgressBar', url:'progress'},
        {title:'Graphics', url:'graphic1'},

      ]
    }
  ]
}
