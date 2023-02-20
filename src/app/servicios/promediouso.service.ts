import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EstadisticaPromedioUso } from '../modelo/estadistica-promedio-uso';
import { FechasPromedioUsoDTO } from '../modelo/fechas-promedio-uso-dto';
import { Parametros } from '../modelo/parametros';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromediousoService {
  estadisticaPromediouso() {
    throw new Error('Method not implemented.');
  }
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

  /**
   * Agrega o actuliza una EstadisticaPromedioUso.
   * @param estadisticaPromedioUso 
   */
  agregarActualizar(estadisticaPromedioUso: EstadisticaPromedioUso): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"promedioUso/agregarActualizar", estadisticaPromedioUso, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  /**
   * Trae una lista de EstadisiticaPromedioUso.
   */
  listarTodo(): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"promedioUso/listarTodo", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  /**
   * Elimina un EstadisticaPromedioUso
   * @param estadisticaPromedioUso
   */
  eliminarRegistro(estadisticaPromedioUso: EstadisticaPromedioUso): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"promedioUso/eliminarRegistro", estadisticaPromedioUso, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  /**
   * Trae una lista de tipo EstadisticaPromedioUso.
   * @param estadisticaPromedioUso 
   */
  traeListaParametros(estadisticaPromedioUso: EstadisticaPromedioUso): Observable<any> {

    return this.http.post<any>(this.parametroHost+"promedioUso/traeListaParametros", estadisticaPromedioUso, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  /**
   * Trae un parametro de tipo EstadisticaPromedioUso.
   * @param estadisticaPromedioUso 
   */
  traeEntidadParametros(estadisticaPromedioUso: EstadisticaPromedioUso): Observable<any> {
    
    return this.http.post<any>(this.parametroHost+"promedioUso/traeEntidadParametros", estadisticaPromedioUso, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  /**
   * Inserta un EstadisticaPromedioUso y verifica si hay uno existente para hacer un 
   * @param estadisticaPromedioUso 
   */
  insertarPromedioUso(estadisticaPromedioUso: EstadisticaPromedioUso[]) {
    
    return this.http.post<any>(this.parametroHost+"promedioUso/insertarPromedioUso", estadisticaPromedioUso, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  /**
   * Dependiendo de un rango de fecha genera un promedio de uso de la app.
   * @param fechasPromedioUsoDTO 
   */
  datosPromUso(fechasPromedioUsoDTO: FechasPromedioUsoDTO) {
    
    return this.http.post<any>(this.parametroHost+"promedioUso/datosPromUso", fechasPromedioUsoDTO, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  usuariosRegistradosApp(){
    return this.http.post<any>(this.parametroHost+"estadisticaServicios/consultaUsuariosApp", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  usuariosAutenticadosXFecha(fechasPromedioUsoDTO: FechasPromedioUsoDTO) {
    
    return this.http.post<any>(this.parametroHost+"estadisticaServicios/consultaUsuariosAutenticadosFecha", fechasPromedioUsoDTO, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

}
