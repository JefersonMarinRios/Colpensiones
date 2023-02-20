import { Rol } from './rol';

export class Usuario {
    id: number;
    colpRol: Rol;
    nombre: String;
    correo: String
    estado: number;
    fecha_creacion: string;
    fecha_actualizacion: string;
}
