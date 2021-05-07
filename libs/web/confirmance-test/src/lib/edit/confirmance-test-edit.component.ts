import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { switchMap, tap } from 'rxjs/operators';

import * as UIKit from 'uikit';

import { ConfirmanceTest, ConfirmanceTestService } from '@caas/web/api';

interface ConfirmanceTestForm {
  name: string;
  version: string;
  dockerImage: string;
}

@Component({
  selector: 'caas-app-confirmance-test-edit',
  templateUrl: './confirmance-test-edit.component.html',
  styleUrls: ['./confirmance-test-edit.component.scss'],
})
export class ConfirmanceTestEditComponent implements OnInit {
  public form: FormGroup;

  public isLoading = true;
  public isSaving = false;
  public errMsgs: string[] = [];

  private currentConfirmanceTest!: ConfirmanceTest;

  constructor(private route: ActivatedRoute, private router: Router, private confirmanceTestService: ConfirmanceTestService) {
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

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => this.confirmanceTestService.getOne(params.id)),
        tap(() => (this.isLoading = false)),
      )
      .subscribe(
        (data) => {
          this.currentConfirmanceTest = data;
          this.form.patchValue({
            name: data.name,
            version: data.version,
            dockerImage: data.dockerImage,
          });
        },
        (error) => {
          UIKit.notification(`Error while loading ConfirmanceTest: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
          this.isLoading = false;
        },
      );
  }

  public onSave({ value, valid }: { value: ConfirmanceTestForm; valid: boolean }): void {
    if (!this.validateForm || !valid || this.isSaving) {
      return;
    }
    this.isSaving = true;

    const testDto: ConfirmanceTest = {
      name: value.name,
      version: value.version,
      dockerImage: value.dockerImage,
    };

    this.confirmanceTestService.updateOne(this.currentConfirmanceTest.id, testDto).subscribe(
      () => (this.isSaving = false),
      (error) => {
        UIKit.notification(`Error while updating ConfirmanceTest: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
        this.isSaving = false;
      },
      () => this.router.navigate(['../'], { relativeTo: this.route }),
    );
  }

  public onReset(): void {
    this.form.patchValue({
      name: this.currentConfirmanceTest.name,
      version: this.currentConfirmanceTest.version,
      dockerImage: this.currentConfirmanceTest.dockerImage,
    });
  }

  public onDelete(): void {
    UIKit.modal.confirm(`Are you sure to delete the ConfirmanceTest: "${this.currentConfirmanceTest.name}"?`).then(() => {
      this.isLoading = true;
      this.confirmanceTestService.deleteOne(this.currentConfirmanceTest.id).subscribe(
        () => (this.isLoading = false),
        (error) => {
          UIKit.notification(`Error while updating ConfirmanceTest: ${error.error.message}`, { pos: 'top-right', status: 'danger' });
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
