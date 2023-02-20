import { IdNombre } from "./idNombre";
import { CiudadPAC } from "./archivo-modelo";

export class ArchivoPAC{
  id: number;
  horario: string;
  latitud:  number;
  longitud:  number;
  categoria: IdNombre;
  nombre: string;
  ciudad: CiudadPAC;
  direccion: string;
  observacion: string;
  estado: number;
}