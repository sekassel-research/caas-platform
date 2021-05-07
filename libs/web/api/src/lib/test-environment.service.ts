import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TestEnvironment } from './test-environment.interface';

@Injectable()
export class TestEnvironmentService {
  constructor(@Inject('ENV_CONF') private environment, private http: HttpClient) {}

  create(testDto: TestEnvironment): Observable<TestEnvironment> {
    return this.http.post<TestEnvironment>(this.environment.httpConf.environment, testDto);
  }

  getAll(): Observable<TestEnvironment[]> {
    return this.http.get<TestEnvironment[]>(this.environment.httpConf.environment);
  }

  getOne(id: string): Observable<TestEnvironment> {
    return this.http.get<TestEnvironment>(`${this.environment.httpConf.environment}/${id}`);
  }

  updateOne(id: string, testDto: TestEnvironment): Observable<TestEnvironment> {
    return this.http.put<TestEnvironment>(`${this.environment.httpConf.environment}/${id}`, testDto);
  }

  deleteOne(id: string): Observable<TestEnvironment> {
    return this.http.delete<TestEnvironment>(`${this.environment.httpConf.environment}/${id}`);
  }
}
