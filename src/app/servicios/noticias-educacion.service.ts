import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';
import { NoticiasEducacion } from '../modelo/noticias-educacion';


@Injectable({
  providedIn: 'root'
})
export class NoticiasEducacionService {public httpOptions = {
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

listarNoticias(): Observable<any> {
  return this.http.get<any>(this.host1 + 'educacion/noticias', this.httpOptions)
    .map(lista => {
      return lista;
    })
}

getNoticia(id: number): Observable<any> {
  return this.http.get<any>(this.host1 + 'educacion/noticias/' + id, this.httpOptions)
    .map(lista => {
      return lista;
    })
}

guardarNoticia(noticia: NoticiasEducacion): Observable<any> {
  return this.http.post<any>(this.host1 + 'educacion/noticias', noticia, this.httpOptions)
    .map(lista => {
      return lista;
    })
}

actualizarNoticia(noticia: NoticiasEducacion): Observable<any> {
  return this.http.put<any>(this.host1 + 'educacion/noticias/' + noticia.id, noticia, this.httpOptions)
    .map(lista => {
      return lista;
    })
}

estadoNoticia(noticia: NoticiasEducacion): Observable<any> {
  return this.http.patch<any>(this.host1 + 'educacion/noticias/' + noticia.id + '/' + noticia.estado, this.httpOptions)
    .map(lista => {
      return lista;
    })
}

eliminarNoticia(noticia: NoticiasEducacion): Observable<any> {
  // return this.http.delete<any>(this.host1+'api/v2/boletines/'+noticia.id, this.httpOptions).map(lista =>{
  return this.http.delete<any>(this.host1 + 'educacion/noticias/' + noticia.id, { observe: 'response' })
  // .map(lista =>{
  //   return lista;
  // })
}

guardarCambios(noticia: NoticiasEducacion, accion: string): Observable<any> {
  if (accion == 'editar') {
    return this.http.put<any>(this.host1 + 'educacion/noticias', noticia, this.httpOptions)
      .map(lista => {
        return lista;
      })
  } else {
    return this.http.post<any>(this.host1 + 'educacion/noticias', noticia, this.httpOptions)
    .map(lista => {
      return lista;
    })
  }

}}
