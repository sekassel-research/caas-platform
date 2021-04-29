import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

import { 
  TestEnvironment, 
  TestEnvironmentService, 
  Artifact, 
  ArtifactService,
  Certificate, 
  CertificateService 
} from '@caas/web/api';

import * as UIKit from 'uikit';

interface TestEnvironmentForm {
  artifact: string;
  certificate: string;
  status: string;
}

@Component({
  selector: 'caas-app-test-environment-new',
  templateUrl: './test-environment-edit.component.html',
  styleUrls: ['./test-environment-edit.component.scss'],
})
export class TestEnvironmentEditComponent {
  public form: FormGroup;

  public isSaving = false;
  public errMsgs: string[] = [];

  public artifacts: Artifact[] = [];
  public certificates: Certificate[] = [];

  public isLoading = true;

  private currentTestEnvironment!: TestEnvironment;

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
        UIKit.notification(`Error while loading Artifacts: ${error.error.message}`, {
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
        UIKit.notification(`Error while loading Certificates: ${error.error.message}`, {
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

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.testEnvironmentService.getOne(params.id)),
        tap(() => (this.isLoading = false)),
      )
      .subscribe(
        (data) => {
          this.currentTestEnvironment = data;
          this.form.patchValue({
            artifact: this.artifactService.getOne(data.artifactID),
            certificate: this.certificateService.getOne(data.certificateID),
            status: data.status,
          });
        },
        (error) => {
          UIKit.notification(`Error while loading Certificate: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
          this.isLoading = false;
        },
      );
  }

  

  public onSave({ value, valid }: { value: TestEnvironmentForm; valid: boolean }): void {
    if (!this.validateForm() || !valid || this.isSaving) {
      return;
    }
    this.isSaving = true;

    const environmentDto: TestEnvironment = {
      artifactID: value.artifact,
      certificateID: value.certificate,
      status: "UPDATE",
    };

    this.testEnvironmentService.updateOne(this.currentTestEnvironment.id, environmentDto).subscribe(
      () => (this.isSaving = false),
      (error) => {
        UIKit.notification(`Error while updating Test Environment: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
        this.isSaving = false;
      },
      () => this.router.navigate(['../'], { relativeTo: this.route }),
    );
  }

  public onDelete(): void {
    UIKit.modal.confirm(`Are you sure to delete the Test Environment: "${this.currentTestEnvironment.id}"?`).then(() => {
      this.isLoading = true;
      this.testEnvironmentService.deleteOne(this.currentTestEnvironment.id).subscribe(
        () => (this.isLoading = false),
        (error) => {
          UIKit.notification(`Error while updating Test Environment: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
          this.isLoading = false;
        },
        () => this.router.navigate(['../'], { relativeTo: this.route }),
      );
    });
  }


  public onReset(): void {
    this.form.patchValue({
      artifact: this.currentTestEnvironment.artifactID,
      certificate: this.currentTestEnvironment.certificateID,
      status: this.currentTestEnvironment.status,
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
