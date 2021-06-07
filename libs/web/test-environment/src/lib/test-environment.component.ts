import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import * as UIKit from 'uikit';

import { EMPTY, forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';

import { ArtifactService, CertificateService, TestEnvironment, TestEnvironmentService } from '@caas/web/api';

@Component({
  selector: 'caas-test-environment',
  templateUrl: './test-environment.component.html',
  styleUrls: ['./test-environment.component.scss'],
})
export class TestEnvironmentComponent implements OnInit, OnDestroy {
  public environments: TestEnvironment[] = [];

  public isLoading = false;

  private routerSubscription: Subscription;

  constructor(
    private router: Router,
    private testEnvironmentService: TestEnvironmentService,
    private artifactService: ArtifactService,
    private certificateService: CertificateService,
  ) {
    this.routerSubscription = this.router.events
    .pipe(
      map((event) => event instanceof NavigationEnd && event.url === '/environments' && event.urlAfterRedirects === '/environments/overview'),
      startWith(true),
      switchMap((shouldLoad) => {
        if (shouldLoad) {
          this.isLoading = true;
          return this.loadElements();
        }
        this.isLoading = false;
        return EMPTY;
      }),
      tap(() => (this.isLoading = false)),
    )
    .subscribe(
      (environments) => {
        this.environments = environments;
      },
      (error) => {
        this.displayErrorMessage(error, 'TestEnvironment');
      }
    );
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadElements().subscribe(
      (environments) => {
        this.environments = environments;
      },
      (error) => {
        this.displayErrorMessage(error, 'TestEnvironment');
      }, 
      () => (this.isLoading = false),
    );
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private loadElements(): Observable<TestEnvironment[]> {
    return this.testEnvironmentService
      .getAll()
      .pipe(switchMap((environments) => forkJoin(environments.map((environment) => this.resolveEnvironment(environment)))));
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
