import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Artifact } from './artifact.interface';
import { ArtifactService } from './artifact.service';

// Workaround to use uikit javascript api
declare const UIkit: any;

@Component({
  selector: 'caas-artifact-runner',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.scss'],
})
export class ArtifactComponent implements OnInit, OnDestroy {
  public artifacts: Artifact[] = [];

  public isLoading = true;

  private routerSubscription: Subscription;

  constructor(
    private router: Router,
    private artifactService: ArtifactService
  ) {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: Event) => {
        const e = event as NavigationEnd;
        if (e.url === '/artifacts' && e.urlAfterRedirects === '/artifacts/overview') {
          this.loadArtifacts();
        }
      });
  }

  ngOnInit(): void {
    this.loadArtifacts();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private loadArtifacts(): void {
    this.isLoading = true;
    this.artifactService.getAll().subscribe(
      (artifacts: Artifact[]) => {
        this.artifacts = artifacts;
      },
      (error) => {
        UIkit.notification(`Error while loading Artifacts: ${error.error.message}`, {
          pos: 'top-right',
          status: 'danger',
        });
        this.isLoading = false;
      },
      () => this.isLoading = false
    );
  }
}
