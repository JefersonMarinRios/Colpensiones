import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';

import { EncuestaPregunta, EncuestaRespuesta, EncuestaParametros } from '../modelo/encuesta';
import { Estrellas } from '../modelo/estrellas';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    })
  };
  host1: string;
  constructor(private http: HttpClient) {
    this.host1 = environment.apiUrl;
    localStorage.setItem("host", this.host1);
  }

  // Seccion Preguntas

  listarPreguntas(): Observable<any> {
    return this.http.get<any>(this.host1 + 'api/v1/encuestapreguntas', this.httpOptions).map(lista => {return lista})
  }

  guardarPregunta(pregunta: EncuestaPregunta): Observable<any> {
    return this.http.post<any>(this.host1 + 'api/v1/encuestapreguntas', pregunta, this.httpOptions).map(lista => {return lista})
  }

  modificarPregunta(pregunta: EncuestaPregunta): Observable<any> {
    return this.http.put<any>(this.host1 + 'api/v1/encuestapreguntas', pregunta, this.httpOptions).map(lista => {return lista})
  }

  formularioPregunta(pregunta: EncuestaPregunta, accion: string): Observable<any> { // Funcion para agregar o modificar pregunta segun parametros 
    if(accion == 'guardar') return this.http.post<any>(this.host1 + 'api/v1/encuestapreguntas', pregunta, this.httpOptions).map(lista => {return lista})
    if(accion == 'editar') return this.http.put<any>(this.host1 + 'api/v1/encuestapreguntas', pregunta, this.httpOptions).map(lista => {return lista})
  }

  getPregunta(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + 'api/v1/encuestapreguntas/' + id, this.httpOptions).map(lista => {return lista})
  }

  patchPregunta(pregunta: EncuestaPregunta): Observable<any>{
    return this.http.patch<any>(this.host1 + 'api/v1/encuestapreguntas/' + pregunta.id + '/' + pregunta.estado, this.httpOptions).map(lista => {return lista})
  }

  /* ****************************************************************************************** */
  
  // Seccion respuestas

  listarRespuestas(): Observable<any> {
    return this.http.get<any>(this.host1 + 'api/v1/encuestarespuestas', this.httpOptions).map(lista => {return lista})
  }

  guardarRespuesta(respuesta: any): Observable<any> {
    return this.http.post<any>(this.host1 + 'api/v1/encuestarespuestas', respuesta, this.httpOptions).map(lista => {return lista})
  }

  modificarRespuesta(respuesta: any): Observable<any> {
    return this.http.put<any>(this.host1 + 'api/v1/encuestarespuestas', respuesta, this.httpOptions).map(lista => {return lista})
  }

  formularioRespuesta(respuesta: any, accion: string): Observable<any> { // Funcion para agregar o modificar pregunta segun parametros 
    if(accion == 'guardar') return this.http.post<any>(this.host1 + 'api/v1/encuestarespuestas', respuesta, this.httpOptions).map(lista => {return lista})
    if(accion == 'editar') return this.http.put<any>(this.host1 + 'api/v1/encuestarespuestas', respuesta, this.httpOptions).map(lista => {return lista})
  }
  
  getRespuesta(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + 'api/v1/encuestarespuestas/'+id, this.httpOptions).map(lista => {return lista})
  }
  
  deleteRespuesta(id: number): Observable<any> {
    return this.http.delete<any>(this.host1 + 'api/v1/encuestarespuestas/'+id, {observe: 'response'}).map(lista => {return lista})
  }

  patchRespuesta(id: number, estado: number): Observable<any>{
    return this.http.patch<any>(this.host1 + 'api/v1/encuestapreguntas/' + id + '/' + estado, this.httpOptions).map(lista => {return lista})
  }
  
  /* ****************************************************************************************** */
  
  // Parametros

  getParametros(): Observable<any> {
    return this.http.get<any>(this.host1 + 'api/v1/parametrosencuensta/', this.httpOptions).map(lista => {return lista})
  }
  
  putParametros(parametros: EncuestaParametros): Observable<any> {
    return this.http.put<any>(this.host1 + 'api/v1/parametrosencuensta/', parametros, this.httpOptions).map(lista => {return lista})
  }
  
  /* ****************************************************************************************** */

  getEstrellas(): Observable<any> {
    return this.http.get<any>(this.host1 + 'calificacion/estrellas', this.httpOptions).map(lista => {return lista})
  }
  
  putEstrellas(estrellas: Estrellas): Observable<any> {
    return this.http.put<any>(this.host1 + 'calificacion/activar/' + estrellas.id, estrellas, this.httpOptions).map(lista => {return lista})
  }
  


}