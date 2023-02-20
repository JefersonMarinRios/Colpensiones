import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../modelo/usuario';
import { AutenticacionDTO } from '../modelo/autenticacion-dto';
// import { Parametros } from '../modelo/parametros';
import { Observable, of } from 'rxjs';
import { URL } from 'url';
// import { ParametrosService } from './parametros.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    })
  };
  usuarioOn: Usuario;
  host1: string;
  constructor(private http: HttpClient, 
    // private parametroService: ParametrosService
    ) {
    // if (environment.esProduccion) {
    //   this.parametroService.parametroHost().subscribe(res => {
    //     var urlAGuardar = JSON.stringify(res);
    //     localStorage.setItem("host", urlAGuardar);
    //     var urlGuardada = localStorage.getItem("host");
    //     var url = JSON.parse(urlGuardada);
    //     this.parametroHost = url.valor;
    //   }, error => { console.log(error); });
    // } else {
      this.host1= environment.apiUrl;
      localStorage.setItem("host", environment.apiUrl);
    // }
    console.log(localStorage.getItem('host'));
  }

  agregar(usuario): Observable<any> {
    return this.http.post<any>(this.host1 + "usuario/crear", usuario, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  editar(usuario, id): Observable<any> {
    return this.http.put<any>(this.host1 + "usuario/modificar/"+id, usuario, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  listarTodo(): Observable<any> {
    return this.http.post<any>(this.host1 + "usuario/listarTodo", this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  eliminarRegistro(usuario: Usuario): Observable<any> {
    return this.http.post<any>(this.host1 + "usuario/eliminarRegistro", usuario, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  traeListaParametros(usuario: Usuario): Observable<any> {

    return this.http.post<any>(this.host1 + "usuario/traeListaParametros", usuario, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  traeEntidadParametros(usuario: Usuario): Observable<any> {
    return this.http.post<any>(this.host1 + "usuario/traeEntidadParametros", usuario, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  consultaNombre(usuario: AutenticacionDTO): Observable<any> {
    //let urlRest = host + 'AppColp/usuario/autenticacion';
    //console.log('URLREST:' + urlRest);
    return this.http.post<any>(this.host1 + "usuario/autenticacion", usuario, this.httpOptions)
      .map(lista => {
        return lista;
      });
  }

  login(usuario: Usuario) {
    localStorage.setItem('usuarioColp', JSON.stringify(usuario));
  }

  logout() {
    localStorage.removeItem('usuarioColp');
    localStorage.clear();
  }

  usuarioSesion(permiso: String) {
    this.usuarioOn = JSON.parse(localStorage.getItem('usuarioColp'));
    if (JSON.parse(localStorage.getItem('usuarioColp')) === 0) {
      return true;
    } if (this.usuarioOn.colpRol.nombre === permiso) {
      return false;
    } if (permiso === 'todos') {
      return false;
    }
    return true;
  }

  filtrar(parametros): Observable<any>{
    return this.http.post<any>(this.host1 + "usuario/buscar", parametros, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

}
