import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import {
  Artifact,
  ArtifactService,
  Certificate,
  CertificateService,
  TestEnvironment,
  TestEnvironmentService
} from '@caas/web/api';

import * as UIKit from 'uikit';

@Component({
  selector: 'caas-test-environment',
  templateUrl: './test-environment.component.html',
  styleUrls: ['./test-environment.component.scss'],
})
export class TestEnvironmentComponent implements OnInit, OnDestroy {
  public environments: TestEnvironment[] = [];
  private artifacts: Artifact[] = [];
  private certificates: Certificate[] = [];

  public isLoading = true;

  private routerSubscription: Subscription;

  constructor(private router: Router,
              private testEnvironmentService: TestEnvironmentService,
              private artifactService: ArtifactService,
              private certificateService: CertificateService,) {
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

  private loadArtifactsAndCertificates(): void {
    this.isLoading = true;
    this.artifactService.getAll().subscribe(
      (artifacts: Artifact[]) => {
        this.artifacts = artifacts;
      },
      (error) => {
        UIKit.notification(`Error while loading Artifacts: ${error.error.message}`, {
          pos: 'top-right',
          status: 'danger',
        });
        this.isLoading = false;
      },
      () => (this.isLoading = false),
    );
    this.certificateService.getAll().subscribe(
      (certificates: Certificate[]) => {
        this.certificates = certificates;
      },
      (error) => {
        UIKit.notification(`Error while loading Certificates: ${error.error.message}`, {
          pos: 'top-right',
          status: 'danger',
        });
        this.isLoading = false;
      },
      () => (this.isLoading = false),
    );
  }

  private loadTestEnvironments(): void {
    this.isLoading = true;
    this.loadArtifactsAndCertificates();

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
      () => {
        this.environments.forEach((e) => {
          e.artifactName = this.artifacts.find(x => x.id == e.artifactId).name;
          e.certificateName = this.certificates.find(x => x.id == e.certificateId).name;
        })
        this.isLoading = false
      },
    );
  }

  onStart(environment: TestEnvironment) {
    this.testEnvironmentService.start(environment.id, environment).subscribe();
  }
}
