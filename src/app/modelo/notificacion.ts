import { Perfil } from "./perfil";

export class Notificacion{
    titulo: string;
    subtitulo: string;
    fecha_inicio: string;
    fecha_final: string;
    tipo: number;
    url: string;
    tipoDocumento: string;
    numeroDocumento: string;
    perfil: Perfil
}