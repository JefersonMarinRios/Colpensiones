import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  public httpOptions = {
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

  listarTodo(): Observable<any> {
    return this.http.get<any>(this.host1 + "reportes", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  listarXFechas(fechas: any): Observable<any> {
    return this.http.post<any>(this.host1 + "reportes/fechas", fechas, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  filtrar(parametros): Observable<any> {
    return this.http.post<any>(this.host1 + "reportes/buscar", parametros, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  pedirParametros(): Observable<any> {
    return this.http.get<any>(this.host1 + "reportes/parametros", this.httpOptions).map(lista => {return lista;});
  }

}