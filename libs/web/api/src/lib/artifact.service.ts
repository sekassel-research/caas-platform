import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Artifact } from './artifact.interface';

@Injectable()
export class ArtifactService {
  constructor(@Inject('ENV_CONF') private environment, private http: HttpClient) {}

  create(artifactDto: Artifact): Observable<Artifact> {
    return this.http.post<Artifact>(this.environment.httpConf.artifact, artifactDto);
  }

  getAll(): Observable<Artifact[]> {
    return this.http.get<Artifact[]>(this.environment.httpConf.artifact);
  }

  getOne(id: string): Observable<Artifact> {
    return this.http.get<Artifact>(`${this.environment.httpConf.artifact}/${id}`);
  }

  updateOne(id: string, artifactDto: Artifact): Observable<Artifact> {
    return this.http.put<Artifact>(`${this.environment.httpConf.artifact}/${id}`, artifactDto);
  }

  deleteOne(id: string): Observable<Artifact> {
    return this.http.delete<Artifact>(`${this.environment.httpConf.artifact}/${id}`);
  }
}
