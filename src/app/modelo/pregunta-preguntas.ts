import { GlobalID } from "./global-id";
export class PreguntaPreguntas{
    id: number;
    nombre: string;
    descripcion: string;
    estado: number;
    categoria: GlobalID | null;
}