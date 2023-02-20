import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
// import { Mensaje } from '../modelo/mensaje';
import { RedSocial } from '../modelo/red-social';
import { ObservableInput } from 'rxjs';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedSocialService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    })
  };
  public httpOptionsDelete = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    }),
    body: null
  };
  host1: string;
  constructor(private http: HttpClient) {
    // if(environment.esProduccion){
    //   this.mensajeHost().subscribe(res => {
    //     var urlAGuardar = JSON.stringify(res);
    //     localStorage.setItem("host", urlAGuardar);
    //     var urlGuardada = localStorage.getItem("host");
    //     var url = JSON.parse(urlGuardada);
    //     this.host1 = url.valor;
    //   }, error => { console.log(error); });
    // }else{
    //   this.host1= environment.apiUrl;
    //   localStorage.setItem("host", this.host1);
    // }
    this.host1 = environment.apiUrl;
    localStorage.setItem("host", this.host1);
  }

  listarRedes(): Observable<any> {
    return this.http.get<any>(this.host1 + "redes/", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  agregar(redSocial: RedSocial): Observable<any> {
    return this.http.post<any>(this.host1 + "redes/red", redSocial, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  editar(redSocial: RedSocial): Observable<any> {
    return this.http.put<any>(this.host1 + "redes/red", redSocial, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  eliminar(redSocial: RedSocial): Observable<any> {
    // return this.http.delete<any>(this.host1 + "redes/red/", this.httpOptions)
    this.httpOptionsDelete.body = redSocial;
    return this.http.delete<any>(this.host1 + "redes/red/", this.httpOptionsDelete)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }


}