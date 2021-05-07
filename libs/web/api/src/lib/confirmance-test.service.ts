import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ConfirmanceTest } from './confirmance-test.interface';

@Injectable()
export class ConfirmanceTestService {
  constructor(@Inject('ENV_CONF') private environment, private http: HttpClient) {}

  create(testDto: ConfirmanceTest): Observable<ConfirmanceTest> {
    return this.http.post<ConfirmanceTest>(this.environment.httpConf.confirmanceTest, testDto);
  }

  getAll(): Observable<ConfirmanceTest[]> {
    return this.http.get<ConfirmanceTest[]>(this.environment.httpConf.confirmanceTest);
  }

  getOne(id: string): Observable<ConfirmanceTest> {
    return this.http.get<ConfirmanceTest>(`${this.environment.httpConf.confirmanceTest}/${id}`);
  }

  updateOne(id: string, testDto: ConfirmanceTest): Observable<ConfirmanceTest> {
    return this.http.put<ConfirmanceTest>(`${this.environment.httpConf.confirmanceTest}/${id}`, testDto);
  }

  deleteOne(id: string): Observable<ConfirmanceTest> {
    return this.http.delete<ConfirmanceTest>(`${this.environment.httpConf.confirmanceTest}/${id}`);
  }
}
