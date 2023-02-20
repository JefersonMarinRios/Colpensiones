import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';

import { CategoriaMasInformacion, SubCategoriaMasInfo } from '../modelo/mas-informacion'; 

@Injectable({
  providedIn: 'root'
})
export class MasInformacionService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
      'Access-Control-Allow-Origin': '*'
    })
  };
  host1: string;
  constructor(private http: HttpClient) {
    this.host1 = environment.apiUrl;
    localStorage.setItem("host", this.host1);
  }

  // CATEGORIAS PRINCIPALES

  listarCategorias(): Observable<any>{
    return this.http.get<any>(this.host1 + `categoriasmasinfo/categorias`, this.httpOptions).map(e => e);
  }
  
  estadoCategoria(categoria: CategoriaMasInformacion): Observable<any>{
    return this.http.put<any>(this.host1 + `categoriasmasinfo/activar/${categoria.id}`, this.httpOptions).map(e => e);
  }

  eliminarCategoria(categoria: CategoriaMasInformacion): Observable<any>{
    return this.http.delete<any>(this.host1 + `categoriasmasinfo/borrar/${categoria.id}`, { observe: 'response' });
  }

  guardarCategoria(categoria: CategoriaMasInformacion): Observable<any>{
    return this.http.post<any>(this.host1 + `categoriasmasinfo/crear`, categoria, this.httpOptions).map(e => e);
  }
  
  actualizarCategoria(categoria: CategoriaMasInformacion): Observable<any>{
    return this.http.put<any>(this.host1 + `categoriasmasinfo/modificar`, categoria, this.httpOptions).map(e => e);
  }
  
  // SUB CATEGORIAS

  listarSub(): Observable<any>{
    return this.http.get<any>(this.host1 + `categoriasmasinfo/subcategorias`, this.httpOptions).map(e => e);
  }

  getSub(id: number): Observable<any>{
    return this.http.get<any>(this.host1 + `categoriasmasinfo/sub/buscarpor/${id}`, this.httpOptions).map(e => e);
  }

  guardarSub(categoria: SubCategoriaMasInfo): Observable<any>{
    return this.http.post<any>(this.host1 + `categoriasmasinfo/sub/agregar`, categoria, this.httpOptions).map(e => e);
  }

  eliminarSub(categoria: SubCategoriaMasInfo): Observable<any>{
    return this.http.delete<any>(this.host1 + `categoriasmasinfo/sub/borrar/${categoria.id}`, { observe: 'response' });
  }

  actualizarSub(categoria: SubCategoriaMasInfo): Observable<any>{
    return this.http.put<any>(this.host1 + `categoriasmasinfo/sub/modificar`, categoria, this.httpOptions).map(e => e);
  }

  estadoSub(categoria: SubCategoriaMasInfo): Observable<any>{
    return this.http.put<any>(this.host1 + `categoriasmasinfo/sub/activar/${categoria.id}`, this.httpOptions).map(e => e);
  }

}
