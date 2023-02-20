import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LineaAtencion } from '../modelo/linea-atencion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LineaAtencionService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    })
  };
  public httpOptionsGet = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*'
    })
  };
  host1: string;
  constructor(private http: HttpClient) {
    this.host1 = environment.apiUrl;
    localStorage.setItem("host", this.host1);
  }

  listarLineas(): Observable<any> {
    return this.http.get<any>(this.host1 + "lineas/", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  guardarCambios(accion: string, registro: LineaAtencion): Observable<any> {
    if (accion == "Actualizar") {
      return this.http.put<any>(this.host1 + "lineas/linea", registro, this.httpOptions)
        .map(lista => {
          if (lista && lista.token) {
          }
          return lista;
        });
    } else {
      return this.http.post<any>(this.host1 + "lineas/linea", registro, this.httpOptions)
        .map(lista => {
          if (lista && lista.token) {
          }
          return lista;
        });
    }
  }

  eliminarLinea(registro: LineaAtencion): Observable<any>{
    let cuerpo = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'observe': 'response'
      }), body: registro
    }
    return this.http.delete<any>(this.host1 + "lineas/linea",  cuerpo).map(e => {return e});
  }
}