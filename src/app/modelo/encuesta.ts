export class EncuestaPregunta {
  id: number;
  pregunta: string;
  tipopregunta: number;
  estado: number;
  idPadre: number;
  preguntaPadre: number; // 1 si es un padre
  rangovalores1: string;
  rangovalores2: string;
  rangoperteneciente: string;
}

export class EncuestaRespuesta {
  id: number; // id registro (respuesta)
  respuesta: string;
  estado: number;
  pregunta: EncuestaPregunta; // id pregunta
}

export class EncuestaParametros {
  agradecimientoEncuesta: string;
  emailEncuesta: string;
  estadoAgradecmineto: number;
  frecuenciaEnvioEncuesta: number;
  id: number;
}