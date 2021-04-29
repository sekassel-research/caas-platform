import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ConfirmanceTest } from './confirmance-test.interface';
import { ConfirmanceTestService } from './confirmance-test.service';

// Workaround to use uikit javascript api
declare const UIkit: any;

@Component({
  selector: 'caas-confirmance-test',
  templateUrl: './confirmance-test.component.html',
  styleUrls: ['./confirmance-test.component.scss'],
})
export class ConfirmanceTestComponent implements OnInit, OnDestroy {
  public tests: ConfirmanceTest[] = [];

  public isLoading = true;

  private routerSubscription: Subscription;

  constructor(private router: Router, private confirmanceTestService: ConfirmanceTestService) {
    this.routerSubscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: Event) => {
      const e = event as NavigationEnd;
      if (e.url === '/tests' && e.urlAfterRedirects === '/tests/overview') {
        this.loadConfirmanceTests();
      }
    });
  }

  ngOnInit(): void {
    this.loadConfirmanceTests();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private loadConfirmanceTests(): void {
    this.isLoading = true;
    this.confirmanceTestService.getAll().subscribe(
      (tests: ConfirmanceTest[]) => {
        this.tests = tests;
      },
      (error) => {
        UIkit.notification(`Error while loading ConfirmanceTests: ${error.error.message}`, {
          pos: 'top-right',
          status: 'danger',
        });
        this.isLoading = false;
      },
      () => (this.isLoading = false),
    );
  }
}