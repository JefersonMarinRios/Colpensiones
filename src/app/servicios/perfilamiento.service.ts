import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ObservableInput } from 'rxjs';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilamientoService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
      'Access-Control-Allow-Origin': '*'
    })
  };
  host1: string;
  constructor(private http: HttpClient) {
      this.host1= environment.apiUrl;
      localStorage.setItem("host", this.host1);
  }

  modificar(registro: any): Observable<any> {
    return this.http.put<any>(this.host1 + "perfilamientotramite/modificar", registro, this.httpOptions)
      .map(lista => {
        return lista;
      });
  }

  listarPerfilamiento(): Observable<any> {
    return this.http.get<any>(this.host1 + "perfilamientotramite/listarTodo", this.httpOptions)
      .map(lista => {
        return lista;
      });
  }

  listarPerfiles(): Observable<any>{
      return this.http.get<any>(this.host1 + "perfiles", this.httpOptions)
  }

}
