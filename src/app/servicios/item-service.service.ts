import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';

import { EstadisticaUsoDTO } from '../modelo/estadistica-uso-dto';
import { DatosEstadisticaUsoDTO } from '../modelo/datos-estadistica-uso-dto';
import { Parametros } from '../modelo/parametros';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

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

  listarTodo(): Observable<any> {
    
    return this.http.post<any>(this.parametroHost + "item/listarTodo", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }
}
