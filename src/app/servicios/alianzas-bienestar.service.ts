import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';
// import model
import { CategoriaAlianzas } from '../modelo/categoria-alianzas';
import { CuponAlianzas } from '../modelo/cupon-alianzas';

@Injectable({
  providedIn: 'root'
})
export class AlianzasBienestarService {
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

  // ************************* CATEGORIAS ************************* // 
  listarCategorias(): Observable<any> {
    return this.http.get<any>(this.host1 + "api/v1/categorias", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  // getAlianzasXCategoria(id): Observable<any> {
  //   return this.http.get<any>(this.host1 + "api/v1/alianzas/categoria/" + id, this.httpOptions)
  //     .map(lista => {
  //       if (lista && lista.token) {
  //       }
  //       return lista;
  //     });
  // }

  cambiarEstadoCategoria(id, categoria): Observable<any> {
    return this.http.patch<any>(this.host1 + `api/v1/categorias/${id}/${categoria.estado}`, null, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  editarCategoria(categoria: CategoriaAlianzas): Observable<any> {
    return this.http.put<any>(this.host1 + `api/v1/categorias`, categoria, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  crearCategoria(categoria: CategoriaAlianzas): Observable<any> {
    return this.http.post<any>(this.host1 + `api/v1/categorias`, categoria, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }
  eliminarCategoria(categoria: CategoriaAlianzas): Observable<any> {
    return this.http.delete<any>(this.host1 + 'api/v3/borrar/' + categoria.id, { observe: 'response' })
    
  }

  // ************************* FIN CATEGORIAS ************************* //

  // ************************* CUPONES ************************* //

  listarCupones(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + "api/v1/alianzas/categoria/" + id, this.httpOptions)
      .map(lista => {
        return lista;
      });
  }

  cambiarEstadoCupon(id, estado): Observable<any> {
    return this.http.patch<any>(this.host1 + `api/v1/alianzas/${id}/${estado}`, null, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  crearCupon(cupon: CuponAlianzas): Observable<any> {
    return this.http.post<any>(this.host1 + `api/v1/alianzas`, cupon, this.httpOptions)
      .map(lista => {
        return lista;
      })
  }

  guardarCupon(cupon: CuponAlianzas, accion: string): Observable<any> {
    if(accion == 'guardar'){
      return this.http.post<any>(this.host1 + `api/v1/alianzas`, cupon, this.httpOptions)
      .map(lista => {
        return lista;
      })
    }
    if(accion == 'editar'){
      return this.http.put<any>(this.host1 + `api/v1/alianzas`, cupon, this.httpOptions)
      .map(lista => {
        return lista;
      })
    }
  }
  
  eliminarCupon(cupon: CuponAlianzas): Observable<any> {
    // return this.http.delete<any>(this.host1+'api/v2/eventos/'+boletin.id, this.httpOptions).map(lista =>{
    return this.http.delete<any>(this.host1 + 'api/v1/alianzas/' + cupon.id, { observe: 'response' })
    // .map(lista =>{
    //   return lista;
    // })
  }
  

  // ************************* FIN CUPONES ************************* //


}