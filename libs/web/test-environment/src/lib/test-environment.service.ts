import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// TODO: This need to be resolved, the env vars should be extracted into a shared module
// https://github.com/nrwl/nx/issues/2570
// eslint-disable-next-line
import { environment } from '@caas/web/env';

import { Observable } from 'rxjs';

import { TestEnvironment } from './test-environment.interface';

@Injectable()
export class TestEnvironmentService {
  constructor(private http: HttpClient) {}

  create(testDto: TestEnvironment): Observable<TestEnvironment> {
    return this.http.post<TestEnvironment>(environment.httpConf.environment, testDto);
  }

  getAll(): Observable<TestEnvironment[]> {
    return this.http.get<TestEnvironment[]>(environment.httpConf.environment);
  }

  getOne(id: string): Observable<TestEnvironment> {
    return this.http.get<TestEnvironment>(`${environment.httpConf.environment}/${id}`);
  }

  updateOne(id: string, testDto: TestEnvironment): Observable<TestEnvironment> {
    return this.http.put<TestEnvironment>(`${environment.httpConf.environment}/${id}`, testDto);
  }

  deleteOne(id: string): Observable<TestEnvironment> {
    return this.http.delete<TestEnvironment>(`${environment.httpConf.environment}/${id}`);
  }
}
