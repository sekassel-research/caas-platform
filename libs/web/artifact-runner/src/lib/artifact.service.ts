import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@caas-platform-web/web/env';

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
