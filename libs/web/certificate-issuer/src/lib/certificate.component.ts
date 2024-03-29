import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { Certificate, CertificateService } from '@caas/web/api';

import * as UIKit from 'uikit';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'caas-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
})
export class CertificateComponent implements OnInit, OnDestroy {
  public certificates: Certificate[] = [];
  public isLoading = true;
  private routerSubscription: Subscription;

  constructor(private router: Router, private certificatesService: CertificateService) {
    this.routerSubscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: Event) => {
      const e = event as NavigationEnd;
      if (e.url === '/certificates' && e.urlAfterRedirects === '/certificates/overview') {
        this.loadCertificates();
      }
    });
  }

  ngOnInit(): void {
    this.loadCertificates();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private loadCertificates(): void {
    this.isLoading = true;
    this.certificatesService.getAll().subscribe(
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
}
