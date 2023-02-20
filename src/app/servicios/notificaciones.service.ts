import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
// import { Mensaje } from '../modelo/mensaje';
import { ObservableInput } from 'rxjs';
import { Observable, of } from 'rxjs';
import { Notificacion } from '../modelo/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*',
    }),
    
  };
  public httpOptionsDownload = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*',
      // 'responseType': 'ResponseContentType.Blob'
      // 'Content-Type':'application/xml'
    })
  };
  public httpOptionsFile = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type, Origin, Accept',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*',
    }),
    body: null
  };
  host1: string;
  constructor(private http: HttpClient) {
    // if(environment.esProduccion){
    //   this.mensajeHost().subscribe(res => {
    //     var urlAGuardar = JSON.stringify(res);
    //     localStorage.setItem("host", urlAGuardar);
    //     var urlGuardada = localStorage.getItem("host");
    //     var url = JSON.parse(urlGuardada);
    //     this.host1 = url.valor;
    //   }, error => { console.log(error); });
    // }else{
    //   this.host1= environment.apiUrl;
    //   localStorage.setItem("host", this.host1);
    // }
    this.host1= environment.apiUrl;
    localStorage.setItem("host", this.host1);
  }

  listarPerfiles(): Observable<any> {
    return this.http.get<any>(this.host1 + "perfiles/", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  guardar(notificacion: any): Observable<any>{
    return this.http.post<any>(this.host1 + "notificaciones/notificacion", notificacion, this.httpOptions)
    .map(lista => {
      if (lista && lista.token) {
      }
      return lista;
    });
  }
  
  addFile(file: any): Observable<any>{
    console.log(file);
    this.httpOptionsFile.body = file;
    console.log(this.httpOptionsFile.body);
    return this.http.post<any>(this.host1 + "notificaciones/agregarArchivo", file, this.httpOptionsFile)
    .map(lista => {
      return lista;
    });  
  }

  downloadFile(): Observable<any> {
    return this.http.get<any>(this.host1 + "descarga/excel/notificaciones", this.httpOptionsDownload)
      .map(lista => {
        return lista;
      });
  }
}