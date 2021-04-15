import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@caas/web/env';
import { Observable } from 'rxjs';

import { Certificate } from './certificate.interface';

@Injectable()
export class CertificateService {
  constructor(private http: HttpClient) {}

  create(certificateDto: Certificate): Observable<Certificate> {
    return this.http.post<Certificate>(environment.httpConf.certificate, certificateDto);
  }

  getAll(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(environment.httpConf.certificate);
  }

  getOne(id: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${environment.httpConf.certificate}/${id}`);
  }

  updateOne(id: string, certificateDto: Certificate): Observable<Certificate> {
    return this.http.put<Certificate>(`${environment.httpConf.certificate}/${id}`, certificateDto);
  }

  deleteOne(id: string): Observable<Certificate> {
    return this.http.delete<Certificate>(`${environment.httpConf.certificate}/${id}`);
  }
}
