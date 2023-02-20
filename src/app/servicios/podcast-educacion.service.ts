import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';

import { PodcastEducacion } from '../modelo/podcast-educacion';

@Injectable({
  providedIn: 'root'
})
export class PodcastEducacionService {

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
   listarPodcasts(): Observable<any> {
    return this.http.get<any>(this.host1 + 'educacion/podcast', this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  getPodcast(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + 'educacion/podcast/' + id, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  guardarPodcast(podcast: PodcastEducacion): Observable<any> {
    return this.http.post<any>(this.host1 + 'educacion/podcast', podcast, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  actualizarPodcast(podcast: PodcastEducacion): Observable<any> {
   return this.http.put<any>(this.host1 + 'educacion/podcast/' + podcast.id,  podcast, this.httpOptions)
      .map(lista => {
        return lista;
      })
 }
  //estadoPodcast
  estadoPodcast(podcast: PodcastEducacion): Observable<any> {
    return this.http.patch<any>(this.host1 + 'educacion/podcast/' + podcast.id + '/' + podcast.estado, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  eliminarPodcast(podcast: PodcastEducacion): Observable<any> {
    return this.http.delete<any>(this.host1 + 'educacion/podcast/' + podcast.id, { observe: 'response' })
  }

  guardarCambios(podcast: PodcastEducacion, accion: string): Observable<any> {
    if (accion == 'editar') {
      return this.http.put<any>(this.host1 + 'educacion/podcast/' + podcast.id, podcast, this.httpOptions)
        .map(lista => {
          return lista;
        })
    } else {
      return this.http.post<any>(this.host1 + 'educacion/podcast', podcast, this.httpOptions)
      .map(lista => {
        return lista;
      })
    }

  }
}
