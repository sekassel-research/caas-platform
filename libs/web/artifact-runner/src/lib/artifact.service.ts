import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// TODO: This need to be resolved, the env vars should be extracted into a shared module
// https://github.com/nrwl/nx/issues/2570
// eslint-disable-next-line
import { environment } from '@caas/web/env';

import { Observable } from 'rxjs';

import { Artifact } from './artifact.interface';

@Injectable()
export class ArtifactService {
  constructor(private http: HttpClient) {}

  create(artifactDto: Artifact): Observable<Artifact> {
    return this.http.post<Artifact>(environment.httpConf.artifact, artifactDto);
  }

  getAll(): Observable<Artifact[]> {
    return this.http.get<Artifact[]>(environment.httpConf.artifact);
  }

  getOne(id: string): Observable<Artifact> {
    return this.http.get<Artifact>(`${environment.httpConf.artifact}/${id}`);
  }

  updateOne(id: string, artifactDto: Artifact): Observable<Artifact> {
    return this.http.put<Artifact>(`${environment.httpConf.artifact}/${id}`, artifactDto);
  }

  deleteOne(id: string): Observable<Artifact> {
    return this.http.delete<Artifact>(`${environment.httpConf.artifact}/${id}`);
  }
}
