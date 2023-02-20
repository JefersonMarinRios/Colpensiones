import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';
// import model
import { EventosBienestar } from '../modelo/eventos-bienestar';

@Injectable({
  providedIn: 'root'
})
export class EventosBienestarService {
  
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

  listarEventos(): Observable<any> {
    return this.http.get<any>(this.host1 + 'api/v1/eventos', this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  getEventos(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + 'api/v1/eventos/' + id, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  guardarEventos(eventos: EventosBienestar): Observable<any> {
    return this.http.post<any>(this.host1 + 'api/v1/eventos', eventos, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  actualizarEventos(eventos: EventosBienestar): Observable<any> {
    return this.http.put<any>(this.host1 + 'api/v1/eventos', eventos, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  estadoEventos(eventos: EventosBienestar): Observable<any> {
    return this.http.patch<any>(this.host1 + 'api/v1/eventos/' + eventos.id + '/' + eventos.estado, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  eliminarEventos(eventos: EventosBienestar): Observable<any> {
    return this.http.delete<any>(this.host1 + 'api/v2/eventos/' + eventos.id, { observe: 'response' })
  }

  guardarCambios(eventos: EventosBienestar, accion: string): Observable<any> {
    if (accion == 'editar') {
      return this.http.put<any>(this.host1 + 'api/v1/eventos', eventos, this.httpOptions)
        .map(lista => {
          return lista;
        })
    } else {
      return this.http.post<any>(this.host1 + 'api/v1/eventos', eventos, this.httpOptions)
      .map(lista => {
        return lista;
      })
    }

  }
}
