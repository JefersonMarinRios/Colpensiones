import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// service
import { PreguntasFrecuentesService } from '../servicios/preguntas-frecuentes.service';
import { NotificacionService } from '../servicios/notificaciones.service';
// models
import { PreguntaPreguntas } from '../modelo/pregunta-preguntas';
import { T } from '@angular/core/src/render3';

@Component({
  selector: 'appcolp-form-preguntas-frecuentes',
  templateUrl: './form-preguntas-frecuentes.component.html',
  styleUrls: ['./form-preguntas-frecuentes.component.css']
})
export class FormPreguntasFrecuentesComponent implements OnInit {

  idCategoria: number | null = null;
  idCategoriaPadre: number | null = null;
  nombreCategoria: string | null = null;
  pregunta: PreguntaPreguntas | null = null;
  preguntas: PreguntaPreguntas[] | null = null;
  preguntasNuevas: PreguntaPreguntas[] = [];

  /* **************** PUSH *************** */
  enviarPUSH: boolean = false; // Interruptor para mostrar formulario PUSH
  contenidoPush: any = null;
  fechaFin: any = null;
  fechaInicio: any = null;
  /* **************** END PUSH *************** */

  accion: string | null = null
  validacionFechas: boolean = true;
  fechasInferior: boolean = false;
  imagenBoton: string = 'check-off-gris';
  camposVacios: any = [];

  /* **************** ALERTAS/MODALES *********************** */

  mensajeModal: String = ""; // mensaje modal alerta
  switchModalAlerta: boolean = false; // interruptor modal alerta
  modalSwitchConfirmacion: boolean = false; // interruptor para mostrar modal confirmación
  textoBotonConfirmacion: string | null = null; // texto boton

  /* **************** END ALERTAS/MODALES *********************** */

  idFila: string | null = null;
  idEliminar: number | null = null;
  tipoEliminar: string | null = null

  constructor(
    private router: Router,
    private service: PreguntasFrecuentesService,
    private route: ActivatedRoute,
    public servicePush: NotificacionService,
  ) {
    this.route
      .queryParamMap
      .subscribe(e => {
        this.idCategoria = parseInt(e.get('opc')); // parametro opc es el id de la alianza
        this.nombreCategoria = e.get('opc2'); 
        this.idCategoriaPadre = parseInt(e.get('opc3')); // parametro opc es el id de la alianza
        this.listarPreguntas();
      });
  }

  ngOnInit() {
    // this.listarPreguntas();
  }

  /************************************************************ */
  listarPreguntas() {
    this.service.listarPreguntas(this.idCategoria, true).subscribe(res => {
      this.preguntas = res;
    })
  }

  /****************************************************************** */

  confirmacion(accion, id, tabla) {
    let idFila = ''
    this.tipoEliminar = tabla;
    if (tabla == 'nuevos') {
      idFila = 'fila-nueva-' + id
    }
    if (tabla == 'registrados') {
      idFila = 'fila-' + id
    }
    if (accion == 'eliminar') {
      this.mensajeModal = "¿Estás seguro que deseas eliminar la pregunta?";
      this.textoBotonConfirmacion = "Eliminar"
      this.idEliminar = id;
    }
    this.idFila = idFila;
    this.modalSwitchConfirmacion = true;
  }

  /**************************************************************** */

  cambiarEstado($event, id: number) {
    this.preguntas.forEach(item => {
      if (item.id == id) {
        this.pregunta = item;
        if (item.estado == 0) {
          item.estado = 1;
          this.pregunta.estado = 1;
        } else {
          item.estado = 0;
          this.pregunta.estado = 0;
        }
      }
    });
    this.service.modificarPregunta(this.pregunta).subscribe(res => {
      let label = this.pregunta.estado > 0 ? "Activo" : "Inactivo";
      document.getElementById("slideEstado-" + id).innerText = label;
    }, err => console.error(err))
  }

  /*********************************************************** */

  addNewPregunta() {
    let pregunta = new PreguntaPreguntas();
    pregunta = {
      categoria: {
        id: this.idCategoria
      },
      descripcion: null,
      nombre: null,
      id: null,
      estado: 1
    }
    this.preguntasNuevas.push(pregunta);
  }

  /****************************************************** */

  cerrarModal(i) {
    if (i == 0) { // confirmacion eliminar
      this.modalSwitchConfirmacion = false;
    }
    if (i == 1) { // confirmacion eliminar
      this.switchModalAlerta = false;
    }
  }

  /*********************************************************************** */

  confirmar() {
    let numeroEliminar: number;
    if (this.tipoEliminar == 'nuevos') {
      for (let i = 0; i < this.preguntasNuevas.length; i++) {
        if (this.preguntasNuevas[i].id == this.idEliminar) {
          numeroEliminar = i;
          break;
        }
      }
      this.preguntasNuevas.splice(numeroEliminar, 1);
      this.alerta('eliminar', 200)
    }
    if (this.tipoEliminar == 'registrados') {
      this.service.borrarPregunta(this.idEliminar).subscribe(res => {
        for (let i = 0; i < this.preguntas.length; i++) {
          if (this.preguntas[i].id == this.idEliminar) {
            numeroEliminar = i;
            break;
          }
        }
        this.preguntas.splice(numeroEliminar, 1);
        this.alerta('eliminar', 200)
      }, err => {
        this.alerta('eliminar', 400)
        console.error(err)
      })
    }
  }

  /*********************************************************************** */

  alertaConfirma(accion, status) {
    this.cerrarModal(0)
    if (status == 200) {
      if (accion == 'guardar') this.mensajeModal = 'Se guardó correctamente la pregunta';
      else if (accion == 'editar') this.mensajeModal = 'Se modificó correctamente la pregunta';
    }else{
      if (accion == 'guardar') this.mensajeModal = 'Hubo un fallo al crear la pregunta';
      else if (accion == 'editar') this.mensajeModal = 'Hubo un fallo al modificar la pregunta';
    }
    this.switchModalAlerta = true;
  }

  /******************************************************************** */

  alerta(accion, status) {
    let accionString = '';
    this.cerrarModal(0)
    if(status == 999) this.mensajeModal = accion;
    else if (status == 200) {
      if (accion == 'eliminar') accionString = 'eliminó la pregunta';
      if (accion == 'push') accionString = 'envió la notificación push';
      this.mensajeModal = 'Se ' + accionString + ' correctamente';
    } else if(status != 200 && status != 999) {
      if (accion == 'eliminar') accionString = 'eliminar la pregunta';
      if (accion == 'push') accionString = 'enviar la notificación push';
      this.mensajeModal = 'Hubo un fallo al ' + accionString;
    }
    this.switchModalAlerta = true;
  }

  /******************************************/

  validarLongitud(event) {
    let input = event.target as HTMLInputElement;

    if (this.enviarPUSH == true) {

      if (input.id == 'inputPush') {
        if (input.value.length == 150) { document.getElementById('spanInputPushC').style.display = 'block'; }
        else if (input.value.length < 150) { document.getElementById('spanInputPushC').style.display = 'none' }
      }
    }
  }

  /******************************************/

  cancelar() {
    this.enviarPUSH = false;
    this.contenidoPush = null;
    this.fechaFin = null;
    this.router.navigateByUrl('preguntasFrecuentes', { skipLocationChange: true })
      .then(() => this.router.navigate(['preguntasFrecuentes'], {queryParams: {opc: this.idCategoriaPadre}}));
      // .then(() => this.router.navigate(['preguntasFrecuentes'], {queryParams: {opc: this.idCategoriaPadre, opc2: this.nombreCategoria}}));
  }

  /* ************************************* */

  guardarCambios(id: number, tipo: string) {
    this.camposVacios = [];
    // tipo == 'registrados' || 'nuevos'
    if (tipo == 'registrados') {

      this.pregunta = this.preguntas.find(e => e.id == id);
      console.log(this.pregunta)
      this.pregunta.nombre = document.getElementById('pregunta-vieja-' + id).innerHTML;
      this.pregunta.descripcion = (document.getElementById('respuesta-vieja-' + id) as HTMLTextAreaElement).value;

      if (this.pregunta.nombre == '' || this.pregunta.nombre == null || this.pregunta.nombre == undefined) this.camposVacios.push('pregunta-nueva-' + id)
      if (this.pregunta.descripcion == '' || this.pregunta.descripcion == null || this.pregunta.descripcion == undefined) this.camposVacios.push('respuesta-nueva-' + id)

      if (this.camposVacios.length > 0) this.camposObligatorios();
      if (this.camposVacios.length == 0) {
        this.service.modificarPregunta(this.pregunta).subscribe(res => {

          this.alertaConfirma('editar', 200);

        }, err => { this.alertaConfirma('editar', 400); console.error(err) })
      }

    } else if (tipo == 'nuevos') {
      this.preguntasNuevas.forEach((e, i) => {
        if (i == id) this.pregunta = e;
      })
      this.pregunta.nombre = document.getElementById('pregunta-nueva-' + id).innerHTML;
      this.pregunta.descripcion = (document.getElementById('respuesta-nueva-' + id) as HTMLTextAreaElement).value;

      if (this.pregunta.nombre == '' || this.pregunta.nombre == null || this.pregunta.nombre == undefined) this.camposVacios.push('pregunta-nueva-' + id)
      if (this.pregunta.descripcion == '' || this.pregunta.descripcion == null || this.pregunta.descripcion == undefined) this.camposVacios.push('respuesta-nueva-' + id)

      if (this.camposVacios.length > 0) this.camposObligatorios();
      if (this.camposVacios.length == 0) {
        this.service.crearPregunta(this.pregunta).subscribe(res => {
          this.alertaConfirma('guardar', 200);
          this.pregunta = res; 
          this.preguntasNuevas.splice(id, 1);
          this.preguntas.push(this.pregunta);
        }, err => { this.alertaConfirma('guardar', 400); console.error(err) })
      }
    }

  }

  /********************************************************************** */

  togglePUSH(e) {
    this.contenidoPush = null;
    this.fechaFin = null;
    this.enviarPUSH = this.enviarPUSH == false ? true : false;
    if (this.enviarPUSH == true) {
      this.imagenBoton = 'check-on-azul';
      e.target.classList.remove('gris');
      e.target.classList.add('azul');
      document.getElementById('checkPush').classList.remove('gris');
      document.getElementById('checkPush').classList.add('azul');
    } else if (this.enviarPUSH == false) {
      this.imagenBoton = 'check-off-gris'
      e.target.classList.remove('azul');
      e.target.classList.add('gris');
      document.getElementById('checkPush').classList.remove('azul');
      document.getElementById('checkPush').classList.add('gris');
    }
  }

  /************************************************************************** */

  camposObligatorios() {

    this.camposVacios.forEach(e => {
      document.getElementById(e).classList.add('campo-vacio');
      if (this.enviarPUSH == true) {

        if (this.camposVacios.includes('inputPush')) {
          document.getElementById('inputPush').classList.add('campo-vacio');
          document.getElementById('spanInputPush').style.display = 'block';
        }
        if (this.camposVacios.includes('fechaFinPush')) {
          document.getElementById('fechaFinPush').classList.add('campo-vacio');
          document.getElementById('spanFechaFinPush').style.display = 'block';
        }
      }
    })
  }

  /************************************************************/

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (this.enviarPUSH == true) {

      if (id == 'inputPush') document.getElementById('spanInputPush').style.display = 'none';
      if (id == 'fechaFinPush') document.getElementById('spanFechaFinPush').style.display = 'none';
    }
  }

  /********** Enviar PUSH****************/

  enviarPush() {
    this.camposVacios = [];
    if (this.contenidoPush == null || this.contenidoPush == '' || this.contenidoPush == undefined) this.camposVacios.push('inputPush');
    if (this.fechaFin == null || this.fechaFin == '' || this.fechaFin == undefined) this.camposVacios.push('fechaFinPush');
    if (this.camposVacios.length > 0) {
      this.camposObligatorios();
    } else {
      this.validacionFechas = true;
      this.convertirFechas();
      let tituloMensajePush = '';
      tituloMensajePush = "Se agregaron preguntas a la categoria " + this.nombreCategoria;
      let envio = {
        "titulo": tituloMensajePush,
        "subtitulo": this.contenidoPush,
        "fecha_final": this.fechaFin,
        "tipo": 1,
        "url": '',
      }
      if(this.validacionFechas == true){
        this.servicePush.guardar(envio).subscribe(res => {
          console.log(res);
          // if (this.accion == 'enviarPush') mensaje = "Se envió la notificacion corectamente"
          this.alerta('push', 200);
        }, err => {
          console.log(err);
          this.alerta('push', 400)
        })
      }else{
        let mensaje = `Rango de fechas no permitido.\n
        Tenga en cuenta las siguientes recomendaciones:\n
        1. La fecha inicial No puede ser menor a la fecha actual.
        2. La fecha final debe ser mayor a la fecha actual.
        3. la fecha inicial No puede ser mayor a la fecha final
        `;
        this.alerta(mensaje, 999); 
      }
    }
  }

  /****************************************************************/

  convertirFechas() {
    // sacar fecha en un objeto tipo Date()
    let fechaActual = new Date();
    let diaActual = fechaActual.getDate() < 9 ? '0' + fechaActual.getDate() : fechaActual.getDate();
    let mesActual = fechaActual.getMonth() < 9 ? '0' + (fechaActual.getMonth() + 1) : fechaActual.getMonth() + 1;
    let fechaActualString = fechaActual.getFullYear().toString() + '/' + mesActual.toString() + '/' + diaActual.toString();
    fechaActual = new Date(fechaActualString)
    let fechaDos = new Date((document.getElementById('fechaFinPush') as HTMLInputElement).value);
    if (this.fechasInferior = true) {
      // Sacar el dia
      let diaDos = fechaDos.getDate() < 9 ? '0' + fechaDos.getDate() : fechaDos.getDate();
      // Sacar el mes
      let mesDos = fechaDos.getMonth() < 9 ? '0' + (fechaDos.getMonth() + 1) : fechaDos.getMonth() + 1;
      this.fechaFin = fechaDos.getFullYear().toString() + '-' + mesDos.toString() + '-' + diaDos.toString();
    }
  }
}
