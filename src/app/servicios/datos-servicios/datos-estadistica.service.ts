import { Injectable } from '@angular/core';
import { EstadisticasusoService } from '../estadisticasuso.service';
import { EstadisticaUsoDTO } from '../../modelo/estadistica-uso-dto';
import { DatosEstadisticaUsoDTO } from '../../modelo/datos-estadistica-uso-dto';

@Injectable({
  providedIn: 'root'
})
export class DatosEstadisticaService {
 listaDatos: DatosEstadisticaUsoDTO;
  estadisticaUsoDTO: EstadisticaUsoDTO;
  constructor(private estadisticadeUsoService: EstadisticasusoService) {
    this.estadisticaUsoDTO = new EstadisticaUsoDTO();
  }

}
