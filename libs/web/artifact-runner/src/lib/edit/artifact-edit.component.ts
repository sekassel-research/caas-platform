import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Artifact, ArtifactService } from '@caas/web/api';

import * as UIKit from 'uikit';

import { switchMap, tap } from 'rxjs/operators';

interface ArtifactForm {
  name: string;
  version: string;
  dockerImage: string;
}

@Component({
  selector: 'caas-app-artifact-runner-edit',
  templateUrl: './artifact-edit.component.html',
  styleUrls: ['./artifact-edit.component.scss'],
})
export class ArtifactEditComponent implements OnInit {
  public form: FormGroup;

  public isLoading = true;
  public isSaving = false;
  public errMsgs: string[] = [];

  private currentArtifact!: Artifact;

  constructor(private route: ActivatedRoute, private router: Router, private artifactService: ArtifactService) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      version: new FormControl('', [Validators.required, Validators.pattern(/\d+\.\d+\.\d+/)]),
      dockerImage: new FormControl('', [Validators.required, Validators.pattern(/([\w-]+\/)?([\w-]+:\d+\.\d+\.\d+)/)]),
      certificate: new FormControl(''),
    });
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get version(): FormControl {
    return this.form.get('version') as FormControl;
  }

  get dockerImage(): FormControl {
    return this.form.get('dockerImage') as FormControl;
  }

  get certificate(): FormControl {
    return this.form.get('certificate') as FormControl;
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.artifactService.getOne(params.id)),
        tap(() => (this.isLoading = false)),
      )
      .subscribe(
        (data) => {
          this.currentArtifact = data;
          this.form.patchValue({
            name: data.name,
            version: data.version,
            dockerImage: data.dockerImage,
            certification: data.certificate || '',
          });
        },
        (error) => {
          UIKit.notification(`Error while loading Artifact: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
          this.isLoading = false;
        },
      );
  }

  public onSave({ value, valid }: { value: ArtifactForm; valid: boolean }): void {
    if (!this.validateForm || !valid || this.isSaving) {
      return;
    }
    this.isSaving = true;

    const artifactDto: Artifact = {
      name: value.name,
      version: value.version,
      dockerImage: value.dockerImage,
    };

    this.artifactService.updateOne(this.currentArtifact.id, artifactDto).subscribe(
      () => (this.isSaving = false),
      (error) => {
        UIKit.notification(`Error while updating Artifacts: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
        this.isSaving = false;
      },
      () => this.router.navigate(['../'], { relativeTo: this.route }),
    );
  }

  public onReset(): void {
    this.form.patchValue({
      name: this.currentArtifact.name,
      version: this.currentArtifact.version,
      dockerImage: this.currentArtifact.dockerImage,
    });
  }

  public onDelete(): void {
    UIKit.modal.confirm(`Are you sure to delete the Artifact: "${this.currentArtifact.name}"?`).then(() => {
      this.isLoading = true;
      this.artifactService.deleteOne(this.currentArtifact.id).subscribe(
        () => (this.isLoading = false),
        (error) => {
          UIKit.notification(`Error while updating Artifacts: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
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
    if (this.dockerImage.invalid && this.dockerImage.errors) {
      if (this.dockerImage.errors.required) {
        this.errMsgs.push('Docker Image is required.');
      }
      if (this.dockerImage.errors.pattern) {
        this.errMsgs.push('Docker Image needs to be formatted as reg/name:version');
      }
    }

    return this.errMsgs.length === 0;
  }
}
