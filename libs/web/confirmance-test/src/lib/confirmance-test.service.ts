import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// TODO: This need to be resolved, the env vars should be extracted into a shared module
// https://github.com/nrwl/nx/issues/2570
// eslint-disable-next-line
import { environment } from '@caas/web/env';

import { Observable } from 'rxjs';

import { ConfirmanceTest } from './confirmance-test.interface';

@Injectable()
export class ConfirmanceTestService {
  constructor(private http: HttpClient) {}

  create(testDto: ConfirmanceTest): Observable<ConfirmanceTest> {
    return this.http.post<ConfirmanceTest>(environment.httpConf.confirmancetest, testDto);
  }

  getAll(): Observable<ConfirmanceTest[]> {
    return this.http.get<ConfirmanceTest[]>(environment.httpConf.confirmancetest);
  }

  getOne(id: string): Observable<ConfirmanceTest> {
    return this.http.get<ConfirmanceTest>(`${environment.httpConf.confirmancetest}/${id}`);
  }

  updateOne(id: string, testDto: ConfirmanceTest): Observable<ConfirmanceTest> {
    return this.http.put<ConfirmanceTest>(`${environment.httpConf.confirmancetest}/${id}`, testDto);
  }

  deleteOne(id: string): Observable<ConfirmanceTest> {
    return this.http.delete<ConfirmanceTest>(`${environment.httpConf.confirmancetest}/${id}`);
  }
}
