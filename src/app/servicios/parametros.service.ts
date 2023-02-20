import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Parametros } from '../modelo/parametros';
import { ArchivoPAC } from '../modelo/archivoPACDTO';
import { ObservableInput } from 'rxjs';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    })
  };
  parametroHost1: string;
  constructor(private http: HttpClient) {
    if(environment.esProduccion){
      this.parametroHost().subscribe(res => {
        var urlAGuardar = JSON.stringify(res);
        localStorage.setItem("host", urlAGuardar);
        var urlGuardada = localStorage.getItem("host");
        var url = JSON.parse(urlGuardada);
        this.parametroHost1 = url.valor;
      }, error => { console.log(error); });
    }else{
      this.parametroHost1= environment.apiUrl;
      localStorage.setItem("host", this.parametroHost1);
    }
  }

  agregar(Parametro: Parametros): Observable<any> {

    return this.http.post<any>(this.parametroHost1 + "parametro/agregar", Parametro, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  actualizar(Parametro: Parametros): Observable<any> {

    return this.http.put<any>(this.parametroHost1 + "parametro/actualizar/"+Parametro.id, Parametro, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  listarTodo(): Observable<any> {
    return this.http.get<any>(this.parametroHost1 + "parametro/listarTodo", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  filtrar(cuerpo): Observable<any>{
    return this.http.post<any>(this.parametroHost1 + "parametro/buscar", cuerpo, this.httpOptions)
      .map(lista =>{
        if(lista && lista.token){}
        return lista;
      })
  }

  eliminarRegistro(Parametro: Parametros): Observable<any> {

    return this.http.post<any>(this.parametroHost1 + "parametro/eliminarRegistro", Parametro, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  traeListaParametros(Parametro: Parametros): Observable<any> {

    return this.http.post<any>(this.parametroHost1 + "parametro/traeListaParametros", Parametro, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  traeEntidadParametros(Parametro: Parametros): Observable<any> {

    return this.http.post<any>(this.parametroHost1 + "parametro/traeEntidadParametros", Parametro, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  archivoPAC(Parametro: ArchivoPAC): Observable<any> {

    return this.http.post<any>(this.parametroHost1 + "pac/archivoPAC", Parametro, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });


  }


  parametroHost(): Observable<any> {
    return this.http.post<any>('parametroHost', this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        //console.log('resultado 1' + lista);
        localStorage.setItem("host", JSON.stringify(lista));
        return lista;
      });
  }


  apiKeyGoogleMaps(): Observable<any> {

    return this.http.post<any>(this.parametroHost1 + "parametro/apiKeyGoogleMaps", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

}
