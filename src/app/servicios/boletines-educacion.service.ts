import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';

import { BoletinesBienestar } from '../modelo/boletines-bienestar';

@Injectable({
  providedIn: 'root'
})
export class BoletinesEducacionService {

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

  listarBoletines(): Observable<any> {
    return this.http.get<any>(this.host1 + 'educacion/boletines', this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  getBoletin(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + 'educacion/boletines/' + id, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  guardarBoletin(boletin: BoletinesBienestar): Observable<any> {
    return this.http.post<any>(this.host1 + 'educacion/boletines', boletin, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  actualizarBoletin(boletin: BoletinesBienestar): Observable<any> {
    return this.http.put<any>(this.host1 + 'educacion/boletines', boletin, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  estadoBoletin(boletin: BoletinesBienestar): Observable<any> {
    return this.http.patch<any>(this.host1 + 'educacion/boletines/' + boletin.id + '/' + boletin.estado, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  eliminarBoletin(boletin: BoletinesBienestar): Observable<any> {
    // return this.http.delete<any>(this.host1+'api/v2/boletines/'+boletin.id, this.httpOptions).map(lista =>{
    return this.http.delete<any>(this.host1 + 'educacion/boletines/' + boletin.id, { observe: 'response' })
    // .map(lista =>{
    //   return lista;
    // })
  }

  guardarCambios(boletin: BoletinesBienestar, accion: string): Observable<any> {
    if (accion == 'editar') {
      return this.http.put<any>(this.host1 + 'educacion/boletines', boletin, this.httpOptions)
        .map(lista => {
          return lista;
        })
    } else {
      return this.http.post<any>(this.host1 + 'educacion/boletines', boletin, this.httpOptions)
      .map(lista => {
        return lista;
      })
    }

  }
}
