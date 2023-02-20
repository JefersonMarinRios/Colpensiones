import { IdNombre } from "./idNombre";

export class Reporte {
  id: number;
  tipoDocumento: TipoDocumento;
  documento: string;
  sistemaOperativo: SistemaOperativo;
  nombreServicio: NombreServicio;
  autenticado: number;
  accion: Accion;
  correo: string;
  fechaReporte: string;
  latitud: number;
  longitud: number;
  ciudad: IdNombre;
  pais: IdNombre;
}

export class TipoDocumento {
  id: number;
  nombre: string
  valor: string;
}

export class SistemaOperativo {
  id: number;
  version: number;
  nombre: string;
}

export class NombreServicio {
  id: number;
  colpLista: ColpLista;
  nombre: string;
  estado: string;
  idApp: number;
}

export class ColpLista {

  id: number;
  nombre: string;
  estado: string;
}

export class Accion {
  id: number;
  nombre: string;
}
