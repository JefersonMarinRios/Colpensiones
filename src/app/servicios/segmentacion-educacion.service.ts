import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';

import { SegmentacionEducacion } from '../modelo/segmentacion-educacion'; 

@Injectable({
  providedIn: 'root'
})
export class SegmentacionEducacionService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    })
  };
  host1: string;

  constructor(private http: HttpClient) {
    this.host1 = environment.apiUrl;
    localStorage.setItem("host", this.host1);
   }
   listarSegmentaciones(): Observable<any> {
    return this.http.get<any>(this.host1 + 'educacion/yosoy', this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  getSegmentacion(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + 'educacion/yosoy/' + id, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  guardarSegmentacion(yosoy: SegmentacionEducacion): Observable<any> {
    return this.http.post<any>(this.host1 + 'educacion/yosoy', yosoy, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  actualizarSegmentacion(yosoy: SegmentacionEducacion): Observable<any> {
   return this.http.put<any>(this.host1 + 'educacion/yosoy',  yosoy, this.httpOptions)
      .map(lista => {
        return lista;
      })
 }
  

  eliminarSegmentacion(yosoy: SegmentacionEducacion): Observable<any> {
    return this.http.delete<any>(this.host1 + 'educacion/yosoy/' + yosoy.id, { observe: 'response' })
  }

  guardarCambios(yosoy: SegmentacionEducacion, accion: string): Observable<any> {
    if (accion == 'editar') {
      return this.http.put<any>(this.host1 + 'educacion/yosoy/' + yosoy.id, yosoy, this.httpOptions)
        .map(lista => {
          return lista;
        })
    } else {
      return this.http.post<any>(this.host1 + 'educacion/yosoy', yosoy, this.httpOptions)
      .map(lista => {
        return lista;
      })
    }

  }

}
