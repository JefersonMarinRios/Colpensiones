import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Mensaje } from '../modelo/mensaje';
import { ObservableInput } from 'rxjs';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
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
  mensajeHost1: string;
  constructor(private http: HttpClient) {
    // if(environment.esProduccion){
    //   this.mensajeHost().subscribe(res => {
    //     var urlAGuardar = JSON.stringify(res);
    //     localStorage.setItem("host", urlAGuardar);
    //     var urlGuardada = localStorage.getItem("host");
    //     var url = JSON.parse(urlGuardada);
    //     this.mensajeHost1 = url.valor;
    //   }, error => { console.log(error); });
    // }else{
    //   this.mensajeHost1= environment.apiUrl;
    //   localStorage.setItem("host", this.mensajeHost1);
    // }
    this.mensajeHost1= environment.apiUrl;
    localStorage.setItem("host", this.mensajeHost1);
  }

  agregarActualizar(parametro: number,Mensaje: Mensaje): Observable<any> {
    // return this.http.post<any>(this.mensajeHost1 + "mensajes/agregarActualizar", Mensaje, this.httpOptions)
    return this.http.put<any>(this.mensajeHost1 + "mensajes/" +parametro, Mensaje, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  listarTodo(parametro: number): Observable<any> {
  // listarTodo(): Observable<any> {
    return this.http.get<any>(this.mensajeHost1 + "mensajes/" +parametro, this.httpOptions)
    // return this.http.post<any>(this.mensajeHost1 + "mensaje/listarTodo", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }


//   mensajeHost(): Observable<any> {
//     return this.http.post<any>('mensajeHost', this.httpOptions)
//       .map(lista => {
//         if (lista && lista.token) {
//         }
//         //console.log('resultado 1' + lista);
//         localStorage.setItem("host", JSON.stringify(lista));
//         return lista;
//       });
//   }
}