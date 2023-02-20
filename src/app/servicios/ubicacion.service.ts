import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Ubicacion } from '../modelo/ubicacion';
import { environment } from '../../environments/environment';
import { UbicacionDTO } from '../modelo/ubicacion-dto';
import { Parametros } from '../modelo/parametros';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

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


  agregarActualizar(ubicacion: Ubicacion): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"ubicacion/agregarActualizar", ubicacion, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  listarTodo(): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"ubicacion/listarTodo", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  traeListaParametros(ubicacion: Ubicacion): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"ubicacion/traeListaParametros", ubicacion, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  traeEntidadParametros(ubicacion: Ubicacion): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"ubicacion/traeEntidadParametros", ubicacion, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  ubicacionXFechas(ubicacion: UbicacionDTO): Observable<Ubicacion[]> {
    
    return this.http.post<any>(this.parametroHost+"ubicacion/ubicacionXFechas", ubicacion, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  ubicacionMesAnterior(ubicacion: UbicacionDTO): Observable<Ubicacion[]> {
    
    return this.http.post<any>(this.parametroHost+"ubicacion/ubicacionMesAnterior", ubicacion, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

}
