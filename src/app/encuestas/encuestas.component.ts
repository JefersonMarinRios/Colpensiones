import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncuestaService } from '../servicios/encuestas.service';
import { EncuestaPregunta, EncuestaRespuesta, EncuestaParametros } from '../modelo/encuesta';

@Component({
  selector: 'appcolp-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.css']
})
export class EncuestasComponent implements OnInit {


  // Objetos de datos 
  pregunta: EncuestaPregunta | null = null;
  preguntaEstado: EncuestaPregunta | null = null;
  preguntaSalvada: EncuestaPregunta | null = null;
  preguntaSalvadaRangos: EncuestaPregunta | null = null;
  listaPreguntas: EncuestaPregunta[] | null = null;
  preguntasGenerales: EncuestaPregunta[] | null = null;
  preguntasMultiples: EncuestaPregunta[] | null = null;
  preguntasHijas: EncuestaPregunta[] | null = null;

  preguntasHijasFiltradas: EncuestaPregunta[] | null = null;
  preguntasHijasRegistro: EncuestaPregunta[] | null = null;

  preguntasCambioRango: EncuestaPregunta[] | null = null;

  respuestas: EncuestaRespuesta[] | null = null;
  respuesta: EncuestaRespuesta | null = null;
  // Editar campo
  idCampo: number = 0;

  // Visualizar encuesta multiple
  idMultiple: number = 0;
  rangoUno: string[] = [];
  rangoDos: string[] = [];
  rangoActivo: number = 0;

  // Crear pregunta
  crearPregunta: string = null;

  // Modales
  switchModalAlerta: boolean = false;
  mensajeModal: string = "";

  idCambioRango: number = null;

  parametros: EncuestaParametros | null = null;

  frecuenciaNueva: number = null;
  correoNueva: number = null;
  agradecimientoNueva: number = null;

  constructor(
    private router: Router,
    private service: EncuestaService
  ) {
    this.pregunta = new EncuestaPregunta();
    this.parametros = new EncuestaParametros();
  }

  ngOnInit() {
    this.listarPreguntas();
    this.listarParametros();
  }

  listarParametros(){
    this.service.getParametros().subscribe(res=>{
      this.parametros = res[0];
      console.log(this.parametros);
    }, err =>{console.error(err)})
  }

  listarPreguntas(){
    this.service.listarPreguntas().subscribe(res=>{
      this.listaPreguntas = res;
      this.preguntasGenerales = this.listaPreguntas.filter(e => e.tipopregunta == 1)
      this.preguntasMultiples = this.listaPreguntas.filter(e => e.tipopregunta == 2 && e.idPadre == 0 && e.preguntaPadre == 1)
      this.preguntasHijas = this.listaPreguntas.filter(e => e.tipopregunta == 2 && e.idPadre != 0 && e.preguntaPadre == 0)
    }, err => console.error(err))
  }

  cambiarEstado($event, id: number, grupo: string){
    let mensaje = ''
    if(grupo != 'respuesta' && grupo != 'parametros'){
      if(grupo == 'general') this.preguntaEstado = this.preguntasGenerales.find(e => e.id == id)
      if(grupo == 'multiple') this.preguntaEstado = this.preguntasMultiples.find(e => e.id == id)
      if(grupo == 'hija') this.preguntaEstado = this.preguntasHijas.find(e => e.id == id)
      this.preguntaEstado.estado = $event.checked == true ? 1 : 0;
      this.service.patchPregunta(this.preguntaEstado).subscribe(res =>{
        mensaje = "Se altero el estado de su encuesta\n\nEstado actual: " + ($event.checked == true ? 'Habilitado' : 'Deshabilitado')
        this.alerta(mensaje)
        console.log(res);
      }, err =>{
        mensaje = "Ocurrió un fallo en su solicitud"
        this.alerta(mensaje)
        console.error(err)
      })
      this.preguntaEstado = new EncuestaPregunta();
    }else if(grupo == 'parametros'){
      this.parametros.estadoAgradecmineto = $event.checked == true ? 1 : 0;
      this.service.putParametros(this.parametros).subscribe(res => {
        mensaje = "Se altero el estado del mensaje de agradecimiento.\n\nEstado actual: " + ($event.checked == true ? 'Habilitado' : 'Deshabilitado')
        this.alerta(mensaje)
        console.log(res)
      }, err =>{
        mensaje = "Ocurrió un fallo en su solicitud"
        this.alerta(mensaje)
        console.error(err)
      })
    }else{
      this.service.patchRespuesta(id, $event.checked).subscribe(res =>{
        mensaje = "Se altero el estado de la respuesta.\n\nEstado actual: " + ($event.checked == true ? 'Habilitado' : 'Deshabilitado')
        this.alerta(mensaje)
        console.log(res)
      }, err =>{
        mensaje = "Ocurrió un fallo en su solicitud"
        this.alerta(mensaje)
        console.error(err)
      })
    }
  }

  cerrarModal(i){
    if(i == 1) this.switchModalAlerta = false // Cerrar modal alerta 
  }

  alerta(mensaje: string){
    this.mensajeModal = mensaje
    this.switchModalAlerta = true // Abrir modal alerta 
  }

  habilitarCampo(id: number, grupo: string){
    this.idCampo = id;
    if(grupo == 'general') this.pregunta = this.preguntasGenerales.find(e => e.id == id)
    if(grupo == 'multiple') this.pregunta = this.preguntasMultiples.find(e => e.id == id)
    if(grupo == 'hija') this.pregunta = this.preguntasHijas.find(e => e.id == id)
    this.preguntaSalvada = this.pregunta
  }

  guardarCampo(id: number, grupo: string){
    let mensaje = '', input = null;
    if(grupo != 'respuesta'){
      if(grupo == 'hija'){this.pregunta = this.preguntasHijasFiltradas.find(e => e.id == id)}
      input = document.getElementById('input-'+grupo+'-'+id) as HTMLInputElement;
      this.pregunta.pregunta = input.value;
      this.service.modificarPregunta(this.pregunta).subscribe(res =>{
        // debugger;
        if(grupo != 'hija'){
          this.idCampo = 0;
          this.pregunta = new EncuestaPregunta();
        }else{
          this.pregunta = this.preguntaSalvada
        }
        mensaje = "Se modifico la pregunta correctamente"
        this.alerta(mensaje)
      }, err => {
        mensaje = "Ocurrió un fallo en su solicitud"
        this.alerta(mensaje)
        console.error(err)
      })
    }else{

    }
  }

  cancelarCambio(id: number, grupo: string){
    if(grupo != 'respuesta'){
      this.pregunta = new EncuestaPregunta(); 
      this.idCampo = 0;
      let input = document.getElementById('input-'+grupo+'-'+id) as HTMLInputElement;
      input.value = this.preguntaSalvada.pregunta;
    }
  }

  habilitarCampoCrear(grupo: string){
    this.idCampo = 99999;
    this.pregunta = new EncuestaPregunta();
    this.crearPregunta = grupo;
  }


  cancelarCambioCrear(grupo: string){
    this.idCampo = 0;
    this.crearPregunta = null;
    this.pregunta = new EncuestaPregunta();
  }

  guardarCampoCrear(grupo: string){
    let input, mensaje = ''
    this.pregunta.estado = 1
    this.pregunta.idPadre = 0;
    this.pregunta.rangoperteneciente = "";
    if(grupo == 'general'){
      this.pregunta.tipopregunta = 1;
      this.pregunta.preguntaPadre = 0;
      this.pregunta.rangovalores1 = "";
      this.pregunta.rangovalores2 = "";
    }
    if(grupo == 'multiple'){
      this.pregunta.tipopregunta = 2;
      this.pregunta.preguntaPadre = 1;
      this.pregunta.rangovalores1 = "1-5"; // en desarrollo
      this.pregunta.rangovalores2 = "6-10"; // en desarrollo
      
    }
    input = document.getElementById('input-'+grupo+'-crear') as HTMLInputElement;
    this.pregunta.pregunta = input.value;

    this.service.guardarPregunta(this.pregunta).subscribe(res => {
      if(grupo == 'multiple'){
        this.preguntasHijasRegistro = [
          {
            id: 0,
            pregunta: 'Pregunta 1',
            tipopregunta: 2,
            estado: 1,
            idPadre: res.id,
            preguntaPadre: 0, 
            rangovalores1: '',
            rangovalores2: '',
            rangoperteneciente: '1-5'
          },
          {
            id: 0,
            pregunta: 'Pregunta 2',
            tipopregunta: 2,
            estado: 1,
            idPadre: res.id,
            preguntaPadre: 0, 
            rangovalores1: '',
            rangovalores2: '',
            rangoperteneciente: '6-10'
          }
        ]
        let test = 0;
        this.preguntasHijasRegistro.forEach(e =>{
          this.service.guardarPregunta(e).subscribe(res => {
            console.log(res)
            test = test + 1;
            if(test == 2){
              mensaje = "Se creo la encuesta "+grupo+" correctamente"
              this.listarPreguntas();
              this.alerta(mensaje)
              this.cancelarCambioCrear(grupo)
            }
          }, err=>{
            mensaje = "Ocurrió un fallo en su solicitud"
            this.alerta(mensaje)
            console.error(err)
          })
        })
      }else{
        mensaje = "Se creo la encuesta "+grupo+" correctamente"
        this.listarPreguntas();
        this.alerta(mensaje)
        this.cancelarCambioCrear(grupo)
      }
    }, err =>{
      mensaje = "Ocurrió un fallo en su solicitud"
      this.alerta(mensaje)
      console.error(err)
    })

  }

  verRegistro(id: number){
    this.pregunta = this.preguntasMultiples.find(e => e.id == id)
    this.preguntaSalvada = this.pregunta;
    this.idCampo = 99999;
    this.idMultiple = id;
    this.crearPregunta = '0000'

    this.rangoUno = this.pregunta.rangovalores1.split('-');
    this.rangoDos = this.pregunta.rangovalores2.split('-');

    this.activarRango(1, this.pregunta.id)
  }
  
  ocultarRegistro(){
    this.pregunta = new EncuestaPregunta()
    this.idMultiple = 0;
    this.idCampo = 0;
    this.crearPregunta = ''
  }

  activarRango(rango: number, id: number){
    // debugger;
    this.rangoActivo = rango;
    if(rango == 1) this.preguntasHijasFiltradas = this.preguntasHijas.filter(e => e.idPadre == id && e.rangoperteneciente == this.pregunta.rangovalores1)
    if(rango == 2) this.preguntasHijasFiltradas = this.preguntasHijas.filter(e => e.idPadre == id && e.rangoperteneciente == this.pregunta.rangovalores2)
    
    this.service.listarRespuestas().subscribe(res=>{
      this.respuestas = res;
      this.respuestas = this.respuestas.filter(e => e.pregunta.id == this.preguntasHijasFiltradas[0].id)
    }, err =>{
      console.log(err);
    })
  }

  cambiarRangos($event, id: number, campo: number){
    let input, valor;
    if(campo == 1) input = document.getElementById('segundo-rango-1-'+id) as HTMLInputElement
    if(campo == 2) input = document.getElementById('primer-rango-2-'+id) as HTMLInputElement

    valor = parseInt($event.target.value);
    if(campo == 1) input.value = valor + 1; 
    else input.value = valor - 1;

    this.idCambioRango = id
    
  }

  guardarRangos(id: number){
    // console.log(this.preguntaSalvada);
    let rangoNuevo1, rangoNuevo2, mensaje, rangoSave1, rangoSave2;

    rangoNuevo1 = (document.getElementById('primer-rango-1-' +id) as HTMLInputElement).value + '-' + (document.getElementById('primer-rango-2-' +id) as HTMLInputElement).value;

    rangoNuevo2 = (document.getElementById('segundo-rango-1-' +id) as HTMLInputElement).value + '-' + (document.getElementById('segundo-rango-2-' +id) as HTMLInputElement).value;
    rangoSave1 = this.pregunta.rangovalores1 
    rangoSave2 = this.pregunta.rangovalores2 
    this.pregunta.rangovalores1 = rangoNuevo1
    this.pregunta.rangovalores2 = rangoNuevo2 

    console.log(this.pregunta);

    this.preguntasCambioRango = this.preguntasHijas.filter(e => e.idPadre == id);
    console.log(this.preguntasCambioRango)

    this.service.modificarPregunta(this.pregunta).subscribe(res =>{
      debugger;
      this.preguntasCambioRango.forEach(e =>{
        if(e.rangoperteneciente == rangoSave1) {
          e.rangoperteneciente = this.pregunta.rangovalores1 
        }
        else if(e.rangoperteneciente == rangoSave2) {
          e.rangoperteneciente = this.pregunta.rangovalores2
        }

        this.service.modificarPregunta(e).subscribe(res =>{
          mensaje = "Se modifico la pregunta correctamente"
          this.alerta(mensaje)
          this.idCambioRango = null;
        }, err => {
          mensaje = "Ocurrió un fallo en su solicitud"
          this.alerta(mensaje)
          console.error(err)
        })
      })
    }, err => {
      mensaje = "Ocurrió un fallo en su solicitud"
      this.alerta(mensaje)
      console.error(err)
    })



  }

  cancelarRangos(id: number){
    this.pregunta = this.preguntaSalvada;
    this.idCambioRango = null;

    this.rangoUno = this.pregunta.rangovalores1.split('-');
    this.rangoDos = this.pregunta.rangovalores2.split('-');

    let input1 = document.getElementById('primer-rango-2-'+id) as HTMLInputElement
    let input2 = document.getElementById('segundo-rango-1-'+id) as HTMLInputElement

    input1.value = this.rangoUno[1];
    input2.value = this.rangoDos[0]; 

  }

  guardarRespuesta(idRespuesta, idPregunta){
    let mensaje;
    if(idRespuesta == 0){ // guardar
      this.respuesta = new EncuestaRespuesta()
      this.respuesta.pregunta = this.preguntasHijasFiltradas.find(e => e.id = idPregunta)
      this.respuesta.id = 0;
      this.respuesta.respuesta = 'Nueva respuesta'
      this.respuesta.estado = 1;
      this.service.guardarRespuesta(this.respuesta).subscribe(res => {
        this.service.listarRespuestas().subscribe(res => {
          this.respuestas = res;
          this.respuestas = this.respuestas.filter(e => e.pregunta.id == idPregunta)
        }, err =>{console.error(err)})
        console.log(res);
        mensaje = "Se creó la respuesta correctamente"
        this.alerta(mensaje)
        
      }, err => {
        console.error(err)
        mensaje = "Ocurrio un fallo al crear la respuesta"
        this.alerta(mensaje)
      })
      
    }else{ // editar
      this.respuesta = this.respuestas.find(e => e.id == idRespuesta);
      this.respuesta.respuesta = (document.getElementById('respuesta-'+idRespuesta) as HTMLInputElement).value;
      this.service.modificarRespuesta(this.respuesta).subscribe(res =>{
        console.log(res);
        mensaje = "Se modifico la respuesta correctamente"
        this.alerta(mensaje)
      }, err=>{
        console.error(err)
        mensaje = "Ocurrio un fallo al modificar la respuesta"
        this.alerta(mensaje)
      })
    }
  }

  eliminarRespuesta(id, idPregunta){
    let mensaje;
    this.respuesta = this.respuestas.find(e => e.id == id);
    this.service.deleteRespuesta(this.respuesta.id).subscribe(res => {
      this.service.listarRespuestas().subscribe(res => {
        this.respuestas = res;
        this.respuestas = this.respuestas.filter(e => e.pregunta.id == idPregunta)
      }, err =>{console.error(err)})
      console.log(res);
      mensaje = "Se eliminó la respuesta correctamente"
      this.alerta(mensaje)
    }, err =>{
      mensaje = "Ocurrio un fallo al eliminar la respuesta"
      this.alerta(mensaje)
      console.error(err);
    })
  }

  cambioFrecuencia($event){
    this.frecuenciaNueva = parseInt($event.target.value);
  }

  cambioAgradecimiento($event){
    this.agradecimientoNueva = $event.target.value;
  }
  
  cambioCorreo($event){
    this.correoNueva = $event.target.value;
  }

  guardarFrecuencia(bool: boolean){
    let mensaje = "";
    if(bool){
      this.parametros.frecuenciaEnvioEncuesta = this.frecuenciaNueva
      this.service.putParametros(this.parametros).subscribe(res=>{
        mensaje = "Se modificó la frecuencia en días de aparición de la encuesta satisfactoriamente."
        this.alerta(mensaje)
        console.log(res);
      }, err =>{
        mensaje = "Ocurrio un fallo al modificar la frecuencia de aparición de la encuestá"
        this.alerta(mensaje)
        console.error(err);
      })
      this.frecuenciaNueva = null;

    }else{
      this.frecuenciaNueva = null;
      let input = document.getElementById('input-frecuencia') as HTMLInputElement;
      input.value = '' + this.parametros.frecuenciaEnvioEncuesta;
    }
  }

  guardarAgradecimiento(bool: boolean){
    let mensaje = "";
    if(bool){
      this.parametros.agradecimientoEncuesta = this.agradecimientoNueva.toString();
      this.service.putParametros(this.parametros).subscribe(res=>{
        mensaje = "Se modificó el mensaje de agradecimiento satisfactoriamente."
        this.alerta(mensaje)
        console.log(res);
      }, err =>{
        mensaje = "Ocurrio un fallo al modificar el mensaje de agradecimiento"
        this.alerta(mensaje)
        console.error(err);
      })
      this.agradecimientoNueva = null;
    }else{
      this.agradecimientoNueva = null;
      let input = document.getElementById('input-agradecimiento') as HTMLInputElement;
      input.value = '' + this.parametros.agradecimientoEncuesta;
    }
  }

  guardarCorreo(bool: boolean){
    let mensaje = "";
    if(bool){
      this.parametros.emailEncuesta = this.correoNueva.toString();
      this.service.putParametros(this.parametros).subscribe(res=>{
        mensaje = "Se modificó el correo de agradecimiento satisfactoriamente."
        this.alerta(mensaje)
        console.log(res);
      }, err =>{
        mensaje = "Ocurrio un fallo al modificar el correo de agradecimiento"
        this.alerta(mensaje)
        console.error(err);
      })
      this.correoNueva = null;
    }else{
      this.correoNueva = null;
      let input = document.getElementById('input-correo') as HTMLInputElement;
      input.value = '' + this.parametros.emailEncuesta;
    }
  }

}
