import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promises',
  templateUrl: './promises.component.html',
  styles: [
  ]
})
export class PromisesComponent implements OnInit {

  ngOnInit(): void {

    this.getUsers().then(users => console.log(users))
    // const promise = new Promise((resolve, reject) => {
    //   if (false) {
    //     resolve('prueba1');
    //   } else {
    //     reject('error');
    //   }
    // });

    // promise.then(message => console.log(message))
    //   .catch(error => console.log('Something bad in the promise', error))

    // console.log('End of init');   
  }

  getUsers() {
    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve(body.data))
    });
  }
}


