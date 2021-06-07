import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

import * as UIKit from 'uikit';

import {Certificate, CertificateService, ConfirmanceTest, ConfirmanceTestService} from '@caas/web/api';

interface CertificateForm {
  name: string;
  version: string;
  signature: string;
  confirmanceTest: string[];
}

@Component({
  selector: 'caas-app-certificate-edit',
  templateUrl: './certificate-edit.component.html',
  styleUrls: ['./certificate-edit.component.scss'],
})
export class CertificateEditComponent implements OnInit {
  public form: FormGroup;

  public isLoading = true;
  public isSaving = false;
  public errMsgs: string[] = [];

  private currentCertificate!: Certificate;

  public masterConfirmanceTests: ConfirmanceTest[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private certificateService: CertificateService, 
    private confirmanceTestService: ConfirmanceTestService
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      version: new FormControl('', [Validators.required, Validators.pattern(/\d+\.\d+\.\d+/)]),
      signature: new FormControl('', [Validators.required]),
      confirmanceTest: new FormControl('', [Validators.required]),
    });
    this.loadConfirmanceTests();
  }

  private loadConfirmanceTests(): void {
    this.isLoading = true;
    this.confirmanceTestService.getAll().subscribe(
      (confirmanceTests: ConfirmanceTest[]) => {
        this.masterConfirmanceTests = confirmanceTests;
      },
      (error) => {
        UIKit.notification(`Error while loading ConfirmanceTests: ${error.error.message}`, {
          pos: 'top-right',
          status: 'danger',
        });
        this.isLoading = false;
      },
      () => (this.isLoading = false),
    );
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get version(): FormControl {
    return this.form.get('version') as FormControl;
  }

  get signature(): FormControl {
    return this.form.get('signature') as FormControl;
  }

  get certificate(): FormControl {
    return this.form.get('certificate') as FormControl;
  }

  get confirmanceTest(): FormControl {
    return this.form.get('confirmanceTest') as FormControl;
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.certificateService.getOne(params.id)),
        tap(() => (this.isLoading = false)),
      )
      .subscribe(
        (data) => {
          this.currentCertificate = data;
          console.log(data)
          this.form.patchValue({
            name: data.name,
            version: data.version,
            signature: data.signature,
            confirmanceTest: data.confirmanceTests
          });
        },
        (error) => {
          UIKit.notification(`Error while loading Certificate: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
          this.isLoading = false;
        },
      );
  }

  public onSave({ value, valid }: { value: CertificateForm; valid: boolean }): void {
    if (!this.validateForm || !valid || this.isSaving) {
      return;
    }
    this.isSaving = true;

    const certificateDto: Certificate = {
      name: value.name,
      version: value.version,
      signature: value.signature,
      confirmanceTests: value.confirmanceTest,
    };

    this.certificateService.updateOne(this.currentCertificate.id, certificateDto).subscribe(
      () => (this.isSaving = false),
      (error) => {
        UIKit.notification(`Error while updating Certificate: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
        this.isSaving = false;
      },
      () => this.router.navigate(['../'], { relativeTo: this.route }),
    );
  }

  public onReset(): void {
    this.form.patchValue({
      name: this.currentCertificate.name,
      version: this.currentCertificate.version,
      signature: this.currentCertificate.signature,
      confirmanceTest: this.currentCertificate.confirmanceTests,
    });
  }

  public onDelete(): void {
    UIKit.modal.confirm(`Are you sure to delete the Certificate: "${this.currentCertificate.name}"?`).then(() => {
      this.isLoading = true;
      this.certificateService.deleteOne(this.currentCertificate.id).subscribe(
        () => (this.isLoading = false),
        (error) => {
          UIKit.notification(`Error while updating Certificates: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
          this.isLoading = false;
        },
        () => this.router.navigate(['../'], { relativeTo: this.route }),
      );
    });
  }

  private validateForm(): boolean {
    this.errMsgs = [];
    if (this.name.invalid && this.name.errors) {
      if (this.name.errors.required) {
        this.errMsgs.push('Name is required.');
      }
    }
    if (this.version.invalid && this.version.errors) {
      if (this.version.errors.required) {
        this.errMsgs.push('Version is required.');
      }
      if (this.version.errors.pattern) {
        this.errMsgs.push('Version needs to be in semantic format, e.g. 1.0.0');
      }
    }
    if (this.signature.invalid && this.signature.errors) {
      if (this.signature.errors.required) {
        this.errMsgs.push('Signature is required.');
      }
    }

    return this.errMsgs.length === 0;
  }
}
