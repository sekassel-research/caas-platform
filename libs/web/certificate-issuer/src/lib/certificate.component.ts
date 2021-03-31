import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'caas-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
})
export class CertificateComponent implements OnInit {
  public isLoading = true;

  constructor() {}

  ngOnInit(): void {
    this.loadCertificates();
  }

  private loadCertificates(): void {
    // TODO logic

    this.isLoading = false;
  }
}
