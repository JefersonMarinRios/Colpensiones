import { Component, OnInit } from '@angular/core';
import { NotificacionService } from '../servicios/notificaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Notificacion } from '../modelo/notificacion';
import { EventosBienestarService } from '../servicios/eventos-bienestar.service'; 
import { EventosBienestar } from '../modelo/eventos-bienestar'; 
import * as moment from 'moment';

@Component({
  selector: 'appcolp-form-eventos',
  templateUrl: './form-eventos.component.html',
  styleUrls: ['./form-eventos.component.css']
})
export class FormEventosComponent implements OnInit {
  
  idEvento: number | null = null;
  evento: EventosBienestar | null = null;

  cuerpoNotificacion: Notificacion;
  file: File | null = null;
  fileBase64: any;
  camposVacios: any = [];
  // modal
  switchModal: boolean = false;
  mensajeModal: String = ""; // mensaje modal alerta
  // fin modal

  modalSwitch: boolean = false;
  contenidoPush: any = null;
  fechaInicio: any = null;
  fechaFin: any = null;
  accion: string | null = null
  presentacion: string | null = null;

  validacionFechas: boolean = true;
  imagenBoton: string = 'check-off-gris';
  enviarPUSH: boolean = false;
  eventoSave: EventosBienestar | null = null;

  fechasInferior: boolean = false;
  selectedTime: any;
  

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  currentScreenSize: any = null;
  claseTamano: string = '';
  boolAccion: boolean = false;
  constructor(
    public service: EventosBienestarService,
    public servicePush: NotificacionService,
    private router: Router,
    private route: ActivatedRoute,
    breakpointObserver: BreakpointObserver
  ) {
    
    this.route
      .queryParamMap
      .subscribe(e => {
        this.idEvento = parseInt(e.get('opc')); // parametro opc es el id de la alianza
      });

    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ]).subscribe(res => {
        console.log('cosa rara');
        console.log(res.breakpoints);
        for (const query of Object.keys(res.breakpoints)) {
          if (res.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query);
          }
        }
        if (this.currentScreenSize == 'Large' || this.currentScreenSize == 'XLarge') this.claseTamano = '';
        if (this.currentScreenSize == 'Medium' || this.currentScreenSize == 'Small' || this.currentScreenSize == 'XSmall') this.claseTamano = 'scroll';
      })
  }

  ngOnInit() {
    this.boolAccion = false;
    if (this.idEvento != 0) {
      this.accion = 'editar'
      this.getEventos();
    } else {
      this.accion = 'guardar'
      this.evento = new EventosBienestar();
    }
  }

  getEventos() {
    this.service.getEventos(this.idEvento).subscribe(res => {
      console.log(res);
      this.evento = res;
    }, err => {
      console.error(err);
    })
    
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'nombreEvento') document.getElementById('spanTitulo').style.display = 'none';
    if (id == 'fechaInicialBoletin') document.getElementById('spanFechaInicialBoletin').style.display = 'none';
    if (id == 'horaBoletin') document.getElementById('spanHoraBoletin').style.display = 'none';
    if (id == 'resumen') document.getElementById('spanMensaje').style.display = 'none';
    if (id == 'url') document.getElementById('spanURL').style.display = 'none';
    if (id == 'inputPush') document.getElementById('spanInputPush').style.display = 'none';
    if (id == 'fechaInicialPush') document.getElementById('spanFechaInicialPush').style.display = 'none';
    if (id == 'fechaFinPush') document.getElementById('spanFechaFinPush').style.display = 'none';
  }


  abirCargaArchivo(event) {
    document.getElementById("cargaImagen").click();
  }

  addFile(files) {
    this.file = files.item(0);
    if (this.file != null) {
      this.getBase64(this.file).then(data => {
        // console.log(data);
        let prueba = data.toString().split(',');
        this.evento.imagen = prueba[1];
      });
    }
    document.getElementById('recuadro-excel').classList.remove('campo-vacio');
    document.getElementById('spanImagen').style.display = 'none';
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let data = reader.result;
        let imagen = (document.getElementById('imagen-recuadro-excel') as HTMLImageElement);
        imagen.src = reader.result.toString();
        resolve(data);
      }
      reader.onerror = error => reject(error);
    })
  }

  validarLongitud(event) {
    let input = event.target as HTMLInputElement;
    if (input.id == 'nombreEvento') {
      if (input.value.length == 100) { document.getElementById('spanTituloC').style.display = 'block'; }
      else if (input.value.length < 100) { document.getElementById('spanTituloC').style.display = 'none' }
    }
    if (input.id == 'resumen') {
      if (input.value.length == 500) { document.getElementById('spanMensajeC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanMensajeC').style.display = 'none' }
    }
    if (input.id == 'dir') {
      if (input.value.length == 100) { document.getElementById('spanDirC').style.display = 'block'; }
      else if (input.value.length < 100) { document.getElementById('spanDirC').style.display = 'none' }
    }
    if (input.id == 'url') {
      if (input.value.length == 500) { document.getElementById('spanURLC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanURLC').style.display = 'none' }
    }
    if(this.enviarPUSH == true){
      if (input.id == 'inputPush') {
        if (input.value.length == 150) { document.getElementById('spanInputPushC').style.display = 'block'; }
        else if (input.value.length < 150) { document.getElementById('spanInputPushC').style.display = 'none' }
      }
    }
  }

  cancelar() {
    this.enviarPUSH = false;
    this.contenidoPush = null;
    this.fechaInicio = null;
    this.fechaFin = null;
    // if (this.idBoletin != 0) {
    //   this.getBoletin();
    // } else {
    //   this.boletin = new BoletinesBienestar();
    // }
    this.cuerpoNotificacion = new Notificacion();
    this.file = null;
    this.router.navigateByUrl('seccionBienestar', { skipLocationChange: true }).then(() => this.router.navigate(['seccionBienestar/eventos']));
  }
  recargar(){ 
    window.location.reload();
   }

  guardarCambios() {
    this.camposVacios = [];
    debugger;

    if (this.evento.imagen == null || this.evento.imagen == '' || this.evento.imagen == undefined) this.camposVacios.push('imagen');
    if (this.evento.nombre == null || this.evento.nombre == '' || this.evento.nombre == undefined) this.camposVacios.push('titulo');
    if (this.evento.fechaInicio == null || this.evento.fechaInicio == '' || this.evento.fechaInicio == undefined) this.camposVacios.push('fechaInicio');
    if (this.evento.hora == null || this.evento.hora == '' || this.evento.hora == undefined) this.camposVacios.push('horaBoletin');
    if (this.evento.resumen == null || this.evento.resumen == '' || this.evento.resumen == undefined) this.camposVacios.push('resumen');
    if (this.evento.url == null || this.evento.url == '' || this.evento.url == undefined) this.camposVacios.push('url');
    if (this.evento.direccion == null || this.evento.direccion == '' || this.evento.direccion == undefined) this.camposVacios.push('dir');
    
    if(this.enviarPUSH == true){
      if (this.contenidoPush == null || this.contenidoPush == '' || this.contenidoPush == undefined) this.camposVacios.push('inputPush');
      if (this.fechaInicio == null || this.fechaInicio == '' || this.fechaInicio == undefined) this.camposVacios.push('fechaInicialPush');
      if (this.fechaFin == null || this.fechaFin == '' || this.fechaFin == undefined) this.camposVacios.push('fechaFinPush');
    }


    if (this.camposVacios.length > 0) {
      this.camposObligatorios();
    } else {
      this.validacionFechas = true;
      if (this.enviarPUSH == true) {
        this.convertirFechas();
      }
      if (this.validacionFechas == true) {
        this.evento.hora = moment(this.evento.hora).add(moment.duration(this.selectedTime)).format('YYYY-MM-DD HH:mm:ss');
        this.service.guardarCambios(this.evento, this.accion).subscribe(res => {
          console.log(res);
          if (this.enviarPUSH == true) {
            let tituloMensajePush = '';
            if (this.accion == 'guardar') tituloMensajePush = "Sección Bienestar: Se agrego el boletín correctamente"
            if (this.accion == 'editar') tituloMensajePush = "Sección Bienestar: Se edito el boletín correctamente"
            let envio = {
              "titulo": tituloMensajePush,
              "subtitulo": this.contenidoPush,
              "fecha_inicio": this.fechaInicio,
              "fecha_final": this.fechaFin,
              "tipo": 1,
              "url": '',
            }
            this.servicePush.guardar(envio).subscribe(res => {
              let mensaje = '';
              if (this.accion == 'guardar') mensaje = "Se agrego el evento correctamente"
              if (this.accion == 'editar') mensaje = "Se edito el evento correctamente"
              this.boolAccion = true;
              this.alerta(mensaje);
            }, err => {
              console.log(err);
              let mensaje = '';
              if (this.accion == 'guardar') mensaje = "Se agrego el evento correctamente, pero hubo un fallo enviando la notificación push"
              if (this.accion == 'editar') mensaje = "Se edito el evento correctamente, pero hubo un fallo enviando la notificación push"
              this.boolAccion = false;
              this.alerta(mensaje);
            })
          }else{
            let mensaje = "";
            if (this.accion == 'guardar') mensaje = "Se agrego el evento correctamente"
            if (this.accion == 'editar') mensaje = "Se edito el evento correctamente"
            this.alerta(mensaje);
            this.boolAccion = true;
          }
        }, err => {
          let mensaje = '';
          console.error(err)
          this.boolAccion = false;
          mensaje = "Ocurrio un fallo en la solicitud"
          this.alerta(mensaje);
        })
      } else {
        let mensaje = `Rango de fechas no permitido.\n
        Tenga en cuenta las siguientes recomendaciones:\n
        1. La fecha inicial <b>No</b> puede ser menor a la fecha actual.
        2. La fecha final <b>debe</b> ser mayor a la fecha actual.
        3. la fecha inicial <b>No</b> puede ser mayor a la fecha final
        `;
        this.alerta(mensaje);
      }
    }
  }

  camposObligatorios() {
    if (this.camposVacios.includes('imagen')) {
      document.getElementById('recuadro-excel').classList.add('campo-vacio');
      document.getElementById('spanImagen').style.display = 'block';
    }
    if (this.camposVacios.includes('titulo')) {
      document.getElementById('nombreEvento').classList.add('campo-vacio');
      document.getElementById('spanTitulo').style.display = 'block';
    }
    if (this.camposVacios.includes('resumen')) {
      document.getElementById('resumen').classList.add('campo-vacio');
      document.getElementById('spanMensaje').style.display = 'block';
    }
    if (this.camposVacios.includes('dir')) {
      document.getElementById('dir').classList.add('campo-vacio');
      document.getElementById('spanDir').style.display = 'block';
    }
    if (this.camposVacios.includes('url')) {
      document.getElementById('url').classList.add('campo-vacio');
      document.getElementById('spanURL').style.display = 'block';
    }
    if (this.camposVacios.includes('fechaInicio')) {
      document.getElementById('fechaInicialBoletin').classList.add('campo-vacio');
      document.getElementById('spanFechaInicialBoletin').style.display = 'block';
    }
    if (this.camposVacios.includes('horaBoletin')) {
      document.getElementById('horaBoletin').classList.add('campo-vacio');
      document.getElementById('spanHoraBoletin').style.display = 'block';
    }

    if(this.enviarPUSH == true){

      if (this.camposVacios.includes('inputPush')) {
        document.getElementById('inputPush').classList.add('campo-vacio');
        document.getElementById('spanInputPush').style.display = 'block';
      }
      if (this.camposVacios.includes('fechaInicialPush')) {
        document.getElementById('fechaInicialPush').classList.add('campo-vacio');
        document.getElementById('spanFechaInicialPush').style.display = 'block';
      }
      if (this.camposVacios.includes('fechaFinPush')) {
        document.getElementById('fechaFinPush').classList.add('campo-vacio');
        document.getElementById('spanFechaFinPush').style.display = 'block';
      }
    }

  }

  convertirFechas() {
    // sacar fecha en un objeto tipo Date()
    let fechaActual = new Date();
    debugger;
    let diaActual = fechaActual.getDate() < 9 ? '0' + fechaActual.getDate() : fechaActual.getDate();
    let mesActual = fechaActual.getMonth() < 9 ? '0' + (fechaActual.getMonth() + 1) : fechaActual.getMonth() + 1;
    let fechaActualString = fechaActual.getFullYear().toString() + '/' + mesActual.toString() + '/' + diaActual.toString();
    fechaActual = new Date(fechaActualString)
    let fechaUno = new Date((document.getElementById('fechaInicialPush') as HTMLInputElement).value);
    let fechaDos = new Date((document.getElementById('fechaFinPush') as HTMLInputElement).value);

    // if(fechaUno <= fechaActual || fechaDos <= fechaActual){
    if (
      (fechaActual > fechaUno || fechaActual >= fechaDos) ||
      (fechaUno >= fechaDos)
    ) {
      this.validacionFechas = false;
    } else {
      this.fechasInferior = true;

      // Sacar el dia
      let diaUno = fechaUno.getDate() < 9 ? '0' + fechaUno.getDate() : fechaUno.getDate();
      let diaDos = fechaDos.getDate() < 9 ? '0' + fechaDos.getDate() : fechaDos.getDate();
      // Sacar el mes
      let mesUno = fechaUno.getMonth() < 9 ? '0' + (fechaUno.getMonth() + 1) : fechaUno.getMonth() + 1;
      let mesDos = fechaDos.getMonth() < 9 ? '0' + (fechaDos.getMonth() + 1) : fechaDos.getMonth() + 1;

      this.fechaInicio = fechaUno.getFullYear().toString() + '-' + mesUno.toString() + '-' + diaUno.toString();
      this.fechaFin = fechaDos.getFullYear().toString() + '-' + mesDos.toString() + '-' + diaDos.toString();
    }
  }

  alerta(message: string) {
    this.switchModal = true;
    this.mensajeModal = message;
  }

  cerrarModal() {
    this.switchModal = false;
    if(this.boolAccion == true){
      this.router.navigateByUrl('seccionBienestar', { skipLocationChange: true }).then(() => this.router.navigate(['seccionBienestar/eventos']));
    }
  }

  togglePUSH(e) {
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

  anadirImagen(item){
    let type = 'image/png';
    const byteCharacters = atob(item.imagen);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: type});
    const imageFile: File = new File([blob], item.nombre, {
      type: "image/png"
    });
    let generatedImage = window.URL.createObjectURL(imageFile);
    document.getElementById('imagen-recuadro-excel').setAttribute('src', generatedImage);
  }
}
