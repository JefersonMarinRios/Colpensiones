import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EstadisticaSistemaOperativo } from '../modelo/estadistica-sistema-operativo';
import { Parametros } from '../modelo/parametros';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SistemaOperativoService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    })
  };
  parametroHost: string;
  constructor(private http: HttpClient) {
    var urlGuardada = localStorage.getItem("host");
    if(environment.esProduccion){
      var url = JSON.parse(urlGuardada);
      this.parametroHost=url.valor;
    }else{
      this.parametroHost=urlGuardada;
    }
  }

  agregarActualizar(estadisticaSistemaOperativo: EstadisticaSistemaOperativo): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"estadisticaSistemaOperativo/agregarActualizar", estadisticaSistemaOperativo, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  listarTodo(fechas:any): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"estadisticaSistemaOperativo/listarTodo", fechas, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  eliminarRegistro(estadisticaSistemaOperativo: EstadisticaSistemaOperativo): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"estadisticaSistemaOperativo/eliminarRegistro", estadisticaSistemaOperativo, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  traeListaParametros(estadisticaSistemaOperativo: EstadisticaSistemaOperativo): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"estadisticaSistemaOperativo/traeListaParametros", estadisticaSistemaOperativo, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  traeEntidadParametros(estadisticaSistemaOperativo: EstadisticaSistemaOperativo): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"estadisticaSistemaOperativo/traeEntidadParametros", estadisticaSistemaOperativo, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  estadisticaSistemaOperativo(): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"estadisticaSistemaOperativo/datosSistemaOperativo", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

}
