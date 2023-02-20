
export class CategoriaMasInformacion {
  id: number;
  nombre: string;
  imagen: string;
  push: number;
  tipo: number; // 1 == informate sobre pensiones || 2 == informate sobre beps
  estado: number;
  fecha_actualizacion: string; //2022-05-03T16:09:15.901+0000
  fecha_creacion: string;// 2022-05-03T16:09:15.901+0000;
}

export class SubCategoriaMasInfo{
  categoriaId: CategoriaMasInformacion;
  estado: number;
  fecha_actualizacion: string;
  fecha_creacion: string;
  id: number;
  imagen: string;
  imagen_contenido: string;
  push: number;
  texto: string;
  titulo: string;
  url: string
}
