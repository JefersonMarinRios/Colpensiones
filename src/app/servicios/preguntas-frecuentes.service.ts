import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';
// import model
import { CategoriaPreguntas } from '../modelo/categoria-preguntas';
import { PreguntaPreguntas } from '../modelo/pregunta-preguntas';

@Injectable({
  providedIn: 'root'
})
export class PreguntasFrecuentesService {

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

  // Listar todas las categorias Principales
  listarCategoriasPrincipales(estado: boolean): Observable<any> {
    let dir = '';
    if (estado == false) dir = 'categoriapregunta/principales'
    else dir = 'categoriapregunta/activadas'
    return this.http.get<any>(this.host1 + dir, this.httpOptions)
    .map(lista => {
      return lista;
    });
  }
  
  // Listar todas las preguntas por categoria
  listarPreguntas(id: number, estado: boolean): Observable<any>{
    let dir = ''
    if(estado == true) dir = 'categoriapregunta/preguntas/todas/';
    else dir = 'categoriapregunta/preguntas/activadas/'
    return this.http.get<any>(this.host1 + dir + id, this.httpOptions)
    .map(lista => {return lista})
  }


  // traer categoria y preguntas
  getCategoriaPreguntas(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + 'categoriapregunta/' + id, this.httpOptions)
    .map(lista => {
        return lista;
      });
  }

  // crear categoria
  crearCategoria(categoria: CategoriaPreguntas): Observable<any>{
    return this.http.post<any>(this.host1 + 'categoriapregunta/crear', categoria, this.httpOptions)
    .map(lista => {
      return lista
    })
  }

  // borrar categoria
  borrarCategoria(id: number): Observable<any>{
    return this.http.delete<any>(this.host1 + 'categoriapregunta/borrar/'+id, { observe: 'response' })
  }

  // modificar categoria
  modificarCategoria(categoria: CategoriaPreguntas): Observable<any>{
    return this.http.put<any>(this.host1 + 'categoriapregunta/modificar', categoria, this.httpOptions)
    .map(lista => {return lista})
  }

  // crear pregunta
  crearPregunta(pregunta: PreguntaPreguntas): Observable<any>{
    return this.http.post<any>(this.host1 + 'categoriapregunta/pregunta/agregar', pregunta, this.httpOptions)
    .map(lista => {
      return lista
    })
  }

  // modificar pregunta
  modificarPregunta(pregunta: PreguntaPreguntas): Observable<any>{
    return this.http.put<any>(this.host1 + 'categoriapregunta/pregunta/modificar', pregunta, this.httpOptions)
    .map(lista => {return lista})
  }

  // borrar pregunta
  borrarPregunta(id: number): Observable<any>{
    return this.http.delete<any>(this.host1 + 'categoriapregunta/pregunta/borrar/'+id, { observe: 'response' })
  }

  

  

}
