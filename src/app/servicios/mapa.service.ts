import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class MapaService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*'
    })
  };
  host: string;
  constructor(private http: HttpClient) {
    this.host= environment.apiUrl;
    localStorage.setItem("host", this.host);
  }

  listarTodo(): Observable<any>{
    return this.http.get<any>(this.host + 'ubicacion/listarTodo', this.httpOptions).map(list => {return list})
  }

  filtrar(fechas): Observable<any>{
    return this.http.post<any>(this.host + 'ubicacion/listarTodo', fechas,this.httpOptions).map(list => {return list})
  }
}
