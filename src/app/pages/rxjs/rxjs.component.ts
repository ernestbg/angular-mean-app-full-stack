import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, filter, interval, map, pipe, retry, take } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor() {
    this.returnObservable().pipe(
      retry(1)
    ).subscribe(
      value => console.log('Subscribe: ', value),
      error => console.warn('Error: ', error),
      () => console.info('observable finished')
    );

    this.intervalSubs = this.returnInterval().subscribe(console.log);

  }
  ngOnDestroy(): void {

    this.intervalSubs.unsubscribe();
    
  }

  


  returnInterval(): Observable<number> {
    return interval(1000)
      .pipe(
        map(value => value + 1),
        filter(value => (value % 2 === 0) ? true : false),
        take(10),
      );

  }

  returnObservable(): Observable<number> {
    return new Observable<number>((observer) => {

      let i = -1;
      const interval = setInterval(() => {
        i++;
        observer.next(i);

        if (i == 4) {
          clearInterval(interval);
          observer.complete();
        }

        if (i == 2) {
          observer.error('i=2');
        }

      }, 1000)
    });




  }


}
