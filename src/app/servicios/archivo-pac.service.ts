import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';
// import model
import { ArchivoPAC } from '../modelo/archivo-PAC';
import { id } from '@swimlane/ngx-charts';

@Injectable({
  providedIn: 'root'
})
export class ArchivoPacService {

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

  listarDepartamentos(): Observable<any> {
    return this.http.get<any>(this.host1 + "pac/departamentos", this.httpOptions)
      .map(lista => {
        return lista;
      });
  }

  listarCiudades(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + "pac/ciudades/" + id, this.httpOptions)
      .map(lista => {
        return lista;
      });
  }
  
  listarCategorias(): Observable<any> {
    return this.http.get<any>(this.host1 + "pac/categorias", this.httpOptions)
      .map(lista => {
        return lista;
      });
  }

  listarRegistros(): Observable<any>{
    return this.http.get<any>(this.host1 + 'pac/listar', this.httpOptions).map(list =>{return list});
  }

  guardarRegistro(parametro: ArchivoPAC): Observable<any>{
    return this.http.post<any>(this.host1 + 'pac/puntoPac', parametro, this.httpOptions).map(list => {return list})
    
  }

  modificarRegistro(parametro: ArchivoPAC): Observable<any>{
    return this.http.put<any>(this.host1 + "pac/puntoPac", parametro, this.httpOptions).map(list => {return list})
  }

  

  borrarRegistro(parametro: ArchivoPAC): Observable<any>{
    let cuerpo = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'observe': 'response'
      }), body: parametro
    }
    return this.http.delete<any>(this.host1 + 'pac/puntoPac', cuerpo)
  }
  
  filtrar(parametros): Observable<any>{
    return this.http.post<any>(this.host1 + "pac/buscar", parametros, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  guardarCambios(parametro: ArchivoPAC, accionFormulario: string): Observable<any> {
    if (accionFormulario == 'editar') {
      return this.http.put<any>(this.host1 + 'pac/puntoPac/', parametro, this.httpOptions)
        .map(lista => {
          return lista;
        })
    } else {
      return this.http.post<any>(this.host1 + 'pac/puntoPac', parametro, this.httpOptions)
      .map(lista => {
        return lista;
      })
    }

  }
}
