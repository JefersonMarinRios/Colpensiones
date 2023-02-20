import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Rol } from '../modelo/rol';
import { Parametros } from '../modelo/parametros';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RolService {

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

  agregarActualizar(rol: Rol): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"rol/agregarActualizar", rol, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  listarTodo(): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"rol/listarTodo", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  eliminarRegistro(rol: Rol): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"rol/eliminarRegistro", rol, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  traeListaParametros(rol: Rol): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"rol/traeListaParametros", rol, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  traeEntidadParametros(rol: Rol): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"rol/traeEntidadParametros", rol, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

}
