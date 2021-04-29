import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Certificate } from './certificate.interface';

@Injectable()
export class CertificateService {
  constructor(@Inject('ENV_CONF') private environment, private http: HttpClient) {}

  create(certificateDto: Certificate): Observable<Certificate> {
    return this.http.post<Certificate>(this.environment.httpConf.certificate, certificateDto);
  }

  getAll(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.environment.httpConf.certificate);
  }

  getOne(id: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.environment.httpConf.certificate}/${id}`);
  }

  updateOne(id: string, certificateDto: Certificate): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.environment.httpConf.certificate}/${id}`, certificateDto);
  }

  deleteOne(id: string): Observable<Certificate> {
    return this.http.delete<Certificate>(`${this.environment.httpConf.certificate}/${id}`);
  }
}
