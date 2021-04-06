import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TestEnvironment } from '../test-environment.interface';
import { TestEnvironmentService } from '../test-environment.service';

import { Artifact } from '../../../../artifact-runner/src/lib/artifact.interface';
import { ArtifactService } from '../../../../artifact-runner/src/lib/artifact.service';

import { Certificate } from '../../../../certificate-issuer/src/lib/certificate.interface';
import { CertificateService } from '../../../../certificate-issuer/src/lib/certificate.service';

// Workaround to use uikit javascript api
declare const UIkit: any;

interface TestEnvironmentForm {
  artifact: string;
  certificate: string;
  status: string;
}

@Component({
  selector: 'caas-app-test-environment-new',
  templateUrl: './test-environment-new.component.html',
  styleUrls: ['./test-environment-new.component.scss'],
})
export class TestEnvironmentNewComponent {
  public form: FormGroup;

  public isSaving = false;
  public errMsgs: string[] = [];

  public artifacts: Artifact[] = [];
  public certificates: Certificate[] = [];

  public isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private testEnvironmentService: TestEnvironmentService, private artifactService: ArtifactService, private certificateService: CertificateService) {
    this.form = new FormGroup({
      artifact: new FormControl('', [Validators.required]),
      certificate: new FormControl('', [Validators.required]),
    });
    this.loadArtifactsAndCertificates();
  }

  private loadArtifactsAndCertificates(): void {
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
    this.certificateService.getAll().subscribe(
      (certificates: Certificate[]) => {
        this.certificates = certificates;
      },
      (error) => {
        UIkit.notification(`Error while loading Certificates: ${error.error.message}`, {
          pos: 'top-right',
          status: 'danger',
        });
        this.isLoading = false;
      },
      () => (this.isLoading = false),
    );
  }

  get artifact(): FormControl {
    return this.form.get('artifact') as FormControl;
  }

  get certificate(): FormControl {
    return this.form.get('certificate') as FormControl;
  }

  public onCreate({ value, valid }: { value: TestEnvironmentForm; valid: boolean }): void {
    if (!this.validateForm() || !valid) {
      return;
    }
    this.isSaving = true;

    const environmentDto: TestEnvironment = {
      artifactID: value.artifact,
      certificateID: value.certificate,
      status: "CREATE",
    };

    console.log(environmentDto)

    this.testEnvironmentService.create(environmentDto).subscribe(
      () => (this.isSaving = false),
      (error) => {
        UIkit.notification(`Error while saving Test Environment: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
        this.isSaving = false;
      },
      () => this.router.navigate(['../'], { relativeTo: this.route }),
    );
  }

  public onClear(): void {
    this.form.patchValue({
      artifact: '',
      certificate: '',
    });
  }

  private validateForm(): boolean {
    this.errMsgs = [];
    if (this.artifact.invalid && this.artifact.errors) {
      if (this.artifact.errors.required) {
        this.errMsgs.push('Artifact is required.');
      }
    }
    if (this.certificate.invalid && this.certificate.errors) {
      if (this.certificate.errors.required) {
        this.errMsgs.push('Certificate is required.');
      }
    }
    return this.errMsgs.length === 0;
  }
}
