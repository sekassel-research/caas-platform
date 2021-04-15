import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Certificate, CertificateService } from '@caas/web/api';

import { switchMap, tap } from 'rxjs/operators';

// Workaround to use uikit javascript api
declare const UIkit: any;

interface CertificateForm {
  name: string;
  version: string;
  signature: string;
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

  constructor(private route: ActivatedRoute, private router: Router, private certificateService: CertificateService) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      version: new FormControl('', [Validators.required, Validators.pattern(/\d+\.\d+\.\d+/)]),
      signature: new FormControl('', [Validators.required]),
    });
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

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.certificateService.getOne(params.id)),
        tap(() => (this.isLoading = false)),
      )
      .subscribe(
        (data) => {
          this.currentCertificate = data;
          this.form.patchValue({
            name: data.name,
            version: data.version,
            signature: data.signature,
          });
        },
        (error) => {
          UIkit.notification(`Error while loading Certificate: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
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
    };

    this.certificateService.updateOne(this.currentCertificate.id, certificateDto).subscribe(
      () => (this.isSaving = false),
      (error) => {
        UIkit.notification(`Error while updating Certificate: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
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
    });
  }

  public onDelete(): void {
    UIkit.modal.confirm(`Are you sure to delete the Certificate: "${this.currentCertificate.name}"?`).then(() => {
      this.isLoading = true;
      this.certificateService.deleteOne(this.currentCertificate.id).subscribe(
        () => (this.isLoading = false),
        (error) => {
          UIkit.notification(`Error while updating Certificates: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
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
