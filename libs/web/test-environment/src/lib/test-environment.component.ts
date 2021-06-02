import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import * as UIKit from 'uikit';

import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, filter, mapTo, switchMap, tap } from 'rxjs/operators';

import { Artifact, ArtifactService, Certificate, CertificateService, TestEnvironment, TestEnvironmentService } from '@caas/web/api';

@Component({
  selector: 'caas-test-environment',
  templateUrl: './test-environment.component.html',
  styleUrls: ['./test-environment.component.scss'],
})
export class TestEnvironmentComponent implements OnInit, OnDestroy {
  public environments: TestEnvironment[] = [];

  public isLoading = true;

  private routerSubscription: Subscription;

  constructor(
    private router: Router,
    private testEnvironmentService: TestEnvironmentService,
    private artifactService: ArtifactService,
    private certificateService: CertificateService,
  ) {
    this.routerSubscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: Event) => {
      const e = event as NavigationEnd;
      if (e.url === '/environments' && e.urlAfterRedirects === '/environments/overview') {
        this.loadElements();
      }
    });
  }

  ngOnInit(): void {
    this.loadElements();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private loadElements(): void {
    this.isLoading = true;

    this.testEnvironmentService
      .getAll()
      .pipe(switchMap((environments) => forkJoin(environments.map((environment) => this.resolveEnvironment(environment)))))
      .subscribe(
        (environments) => {
          this.environments = environments;
        },
        (error) => {
          this.displayErrorMessage(error, 'TestEnvironment');
        },
        () => {
          this.isLoading = false;
        },
      );
  }

  private resolveEnvironment(environment: TestEnvironment): Observable<TestEnvironment> {
    return forkJoin([
      this.artifactService.getOne(environment.artifactId).pipe(
        tap((artifact) => (environment.artifactName = artifact.name)),
        catchError((error) => {
          this.displayErrorMessage(error, 'Artifact');
          return of(undefined);
        }),
      ),
      this.certificateService.getOne(environment.certificateId).pipe(
        tap((certificate) => (environment.certificateName = certificate.name)),
        catchError((error) => {
          this.displayErrorMessage(error, 'Certificate');
          return of(undefined);
        }),
      ),
    ]).pipe(mapTo(environment));
  }

  displayErrorMessage(error: any, message: string) {
    UIKit.notification(`Error while loading ${message}: ${error.error.message}`, {
      pos: 'top-right',
      status: 'danger',
    });
  }

  onStart(environment: TestEnvironment) {
    this.testEnvironmentService.startTestEnvironment(environment.id, environment).subscribe();
  }
}
