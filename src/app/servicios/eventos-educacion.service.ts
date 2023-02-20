import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, ObservableInput } from 'rxjs';
import { Region, IdNombre, Departamento, Municipio} from '../modelo/idNombre';
import { EventosEducacion } from '../modelo/eventos-educacion';
import { PersonaEventoEducacion } from '../modelo/persona-eventos-educacion'; 

@Injectable({
  providedIn: 'root'
})
export class EventosEducacionService {

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

  // ************************* Listar todas las regiones, departamentos y municipios  ************************* // 
  listarLugares(): Observable<any> {
    return this.http.get<any>(this.host1 + "educacion/eventos/todos", this.httpOptions)
      .map(lista => {
        return lista;
      });
  }

  // ************************* Listar todas las regiones  ************************* // 
  listarRegiones(): Observable<any> {
    return this.http.get<any>(this.host1 + "educacion/eventos/regiones", this.httpOptions)
      .map(lista => {
        return lista;
      });
  }

  // ************************* Listar los departamentos por region  ************************* // 
  listarDepartamentos(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + "educacion/eventos/departamentos/" + id, this.httpOptions)
      .map(lista => {
        return lista;
      });
  }

  // ************************* Listar los municipios por departamento  ************************* // 
  listarMunicipios(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + "educacion/eventos/municipios/" + id, this.httpOptions)
      .map(lista => {
        return lista;
      });
  }


  // ************************* Listar todos los eventos  ************************* // 
  listarEventos(): Observable<any> {
    return this.http.get<any>(this.host1 + "educacion/eventos", this.httpOptions)
      .map(lista => {
        return lista;
      });
  }

  // ************************* Listar evento por id del evento  ************************* // 
  listarEventoId(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + "educacion/eventos/"+id, this.httpOptions)
      .map(lista => {
        return lista;
      });
  }

  // ************************* Listar evento por id del municipio  ************************* // 
  listarEventoMunicipio(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + "educacion/eventos/activos/"+id, this.httpOptions)
    .map(lista => {
      return lista;
    });
  }
  
  // ************************* Editar evento ************************* // 
  editarEvento(evento: EventosEducacion): Observable<any> {
    return this.http.put<any>(this.host1 + "educacion/eventos", evento, this.httpOptions)
    .map(lista => {
      return lista;
    })
  }
  
  // ************************* Crear evento ************************* // 
  crearEvento(evento: EventosEducacion): Observable<any> {
    return this.http.post<any>(this.host1 + "educacion/eventos", evento, this.httpOptions)
    .map(lista => {
      return lista;
    })
  }
  
  // ************************* Eliminar evento ************************* // 
  eliminarEvento(id: number): Observable<any> {
    return this.http.delete<any>(this.host1 + 'educacion/eventos/' + id, { observe: 'response' })
  }

  editar(usuario, id): Observable<any> {
    return this.http.put<any>(this.host1 + "educacion/eventos/"+id, usuario, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  // ************************* Lista de asistentes  ************************* // 
  listarPersonas(id: number): Observable<any> {
    return this.http.get<any>(this.host1 + "educacion/eventos/usuario/"+id, this.httpOptions)
    .map(lista => {
      return lista;
    });
  }

  // ************************* Crear evento ************************* // 
  registrarPersonaEvento(persona: PersonaEventoEducacion): Observable<any> {
    return this.http.post<any>(this.host1 + "educacion/eventos/usuario", persona, this.httpOptions)
    .map(lista => {
      return lista;
    })
  }
  
  filtrar(parametros): Observable<any>{
    return this.http.post<any>(this.host1 + "educacion/eventos/buscar", parametros, this.httpOptions)
      .map(lista => {
        if (lista && lista.token) {
        }
        return lista;
      });
  }

  // ********************** Guardar cambios *************************** //
  guardarCambios(evento: EventosEducacion, accion: string): Observable<any> {
    if (accion == 'editar') {
      return this.http.put<any>(this.host1 + 'educacion/eventos', evento, this.httpOptions)
        .map(lista => {
          return lista;
        })
    } else {
      return this.http.post<any>(this.host1 + 'educacion/eventos', evento, this.httpOptions)
      .map(lista => {
        return lista;
      })
    }

  }
  
} 
