import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Artifact } from '../artifact.interface';
import { ArtifactService } from '../artifact.service';

// Workaround to use uikit javascript api
declare const UIkit: any;

interface ArtifactForm {
  name: string;
  version: string;
  dockerImage: string;
}

@Component({
  selector: 'caas-app-artifact-runner-new',
  templateUrl: './artifact-new.component.html',
  styleUrls: ['./artifact-new.component.scss'],
})
export class ArtifactNewComponent {
  public form: FormGroup;

  public isSaving = false;
  public errMsgs: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private artifactService: ArtifactService) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      version: new FormControl('', [Validators.required, Validators.pattern(/\d+\.\d+\.\d+/)]),
      dockerImage: new FormControl('', [Validators.required, Validators.pattern(/([\w-]+\/)?([\w-]+:\d+\.\d+\.\d+)/)]),
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

  public onCreate({ value, valid }: { value: ArtifactForm; valid: boolean }): void {
    if (!this.validateForm() || !valid) {
      return;
    }
    this.isSaving = true;

    const artifactDto: Artifact = {
      name: value.name,
      version: value.version,
      dockerImage: value.dockerImage,
    };

    this.artifactService.create(artifactDto).subscribe(
      () => (this.isSaving = false),
      (error) => {
        UIkit.notification(`Error while saving Artifacts: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
        this.isSaving = false;
      },
      () => this.router.navigate(['../'], { relativeTo: this.route }),
    );
  }

  public onClear(): void {
    this.form.patchValue({
      name: '',
      version: '',
      dockerImage: '',
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
