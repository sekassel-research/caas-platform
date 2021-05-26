import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { concat, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Artifact, ArtifactService, Certificate, CertificateService, TestEnvironment, TestEnvironmentService } from '@caas/web/api';

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

    const list = [];
    concat(this.artifactService.getAll(), this.certificateService.getAll(), this.testEnvironmentService.getAll()).subscribe(
      (val) => {
        list.push(val);
      },
      (error) => {
        let name = 'undefined';
        switch (list.length) {
          case 0:
            name = 'artifacts';
            break;
          case 1:
            name = 'certificates';
            break;
          case 2:
            name = 'test-environments';
            break;
        }
        UIKit.notification(`Error while loading ${name}: ${error.error.message}`, {
          pos: 'top-right',
          status: 'danger',
        });
        this.isLoading = false;
      },
      () => {
        this.artifacts = list[0];
        this.certificates = list[1];
        this.environments = list[2];
        this.environments.forEach((e) => {
          e.artifactName = this.artifacts.find((x) => x.id == e.artifactId).name;
          e.certificateName = this.certificates.find((x) => x.id == e.certificateId).name;
        });
        this.isLoading = false;
      },
    );
  }

  onStart(environment: TestEnvironment) {
    this.testEnvironmentService.startTestEnvironment(environment.id, environment).subscribe();
  }
}
