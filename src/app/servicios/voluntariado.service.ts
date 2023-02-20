import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ObservableInput } from 'rxjs';
import { Observable, of } from 'rxjs';
// import model
import { Voluntariado } from '../modelo/voluntariado';

@Injectable({
  providedIn: 'root'
})
export class VoluntariadoService {
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
    this.mensajeHost1= environment.apiUrl;
    localStorage.setItem("host", this.mensajeHost1);
  }

  agregarActualizar(voluntariado: any): Observable<any> {
    // return this.http.post<any>(this.mensajeHost1 + "mensajes/agregarActualizar", Mensaje, this.httpOptions)
    return this.http.put<any>(this.mensajeHost1 + "api/v1/voluntariados/", voluntariado, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  listarTodo(): Observable<any> {
    return this.http.get<any>(this.mensajeHost1 + "api/v1/voluntariados/", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }


}