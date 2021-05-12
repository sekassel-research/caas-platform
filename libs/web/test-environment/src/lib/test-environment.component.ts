import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { TestEnvironment, TestEnvironmentService } from '@caas/web/api';

import * as UIKit from 'uikit';

@Component({
  selector: 'caas-test-environment',
  templateUrl: './test-environment.component.html',
  styleUrls: ['./test-environment.component.scss'],
})
export class TestEnvironmentComponent implements OnInit, OnDestroy {
  public environments: TestEnvironment[] = [];

  public isLoading = true;

  private routerSubscription: Subscription;

  constructor(private router: Router, private testEnvironmentService: TestEnvironmentService) {
    this.routerSubscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: Event) => {
      const e = event as NavigationEnd;
      if (e.url === '/environments' && e.urlAfterRedirects === '/environments/overview') {
        this.loadTestEnvironments();
      }
    });
  }

  ngOnInit(): void {
    this.loadTestEnvironments();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private loadTestEnvironments(): void {
    this.isLoading = true;
    this.testEnvironmentService.getAll().subscribe(
      (environments: TestEnvironment[]) => {
        this.environments = environments;
      },
      (error) => {
        UIKit.notification(`Error while loading Test Environments: ${error.error.message}`, {
          pos: 'top-right',
          status: 'danger',
        });
        this.isLoading = false;
      },
      () => (this.isLoading = false),
    );
  }

  onStart(environment: TestEnvironment) {
    this.testEnvironmentService.start(environment.id, environment).subscribe();
  }
}
