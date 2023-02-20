import { GlobalID } from "./global-id";
export class CategoriaPreguntas {
  id: number;
  nombre: string;
  url: string;
  estado: number;
  icono: string;
  categoria: GlobalID | null;
}