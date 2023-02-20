
export class IdNombre{
  id: number;
  nombre: string;
}


export class Region{
  id: number;
  nombre: string;
}

 
export class Departamento{
  id: number;
  id_region: number;
  nombre: string;
}


export class Municipio{
  id: number;
  id_departamento: number;
  nombre: string;
}