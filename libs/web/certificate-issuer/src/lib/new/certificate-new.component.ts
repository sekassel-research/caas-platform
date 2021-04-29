import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as UIKit from 'uikit';

import { Certificate, CertificateService } from '@caas/web/api';

interface CertificateForm {
  name: string;
  version: string;
  signature: string;
}

@Component({
  selector: 'caas-certificate-new',
  templateUrl: './certificate-new.component.html',
  styleUrls: ['./certificate-new.component.scss'],
})
export class CertificateNewComponent {
  public form: FormGroup;

  public isSaving = false;
  public errMsgs: string[] = [];

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

  public onCreate({ value, valid }: { value: CertificateForm; valid: boolean }): void {
    if (!this.validateForm() || !valid) {
      return;
    }
    this.isSaving = true;

    const certificateDto: Certificate = {
      name: value.name,
      version: value.version,
      signature: value.signature,
    };

    this.certificateService.create(certificateDto).subscribe(
      () => (this.isSaving = false),
      (error) => {
        UIKit.notification(`Error while saving Certificates: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
        this.isSaving = false;
      },
      () => this.router.navigate(['../'], { relativeTo: this.route }),
    );
  }

  public onClear(): void {
    this.form.patchValue({
      name: '',
      version: '',
      signature: '',
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
        this.errMsgs.push('Signatur is required.');
      }
    }

    return this.errMsgs.length === 0;
  }
}
