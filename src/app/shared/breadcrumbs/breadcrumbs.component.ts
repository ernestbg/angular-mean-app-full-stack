import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  public title: string | undefined;
  public titleSubs: Subscription;

  constructor(private router: Router, private route:ActivatedRoute) {

    //route.snapshot.children[0].data
    
    this.titleSubs = this.getRouteArguments().subscribe(({ title }) => {
      this.title = title;
      document.title = `Admin pro-${title}`;
    });


  }
  ngOnDestroy(): void {
    this.titleSubs.unsubscribe();
  }

  getRouteArguments() {
    return this.router.events.pipe(
      filter((event: any) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data),
    )

  }

}
