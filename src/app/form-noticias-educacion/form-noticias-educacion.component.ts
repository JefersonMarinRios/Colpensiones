import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificacionService } from '../servicios/notificaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Notificacion } from '../modelo/notificacion';
import { NoticiasEducacionService } from '../servicios/noticias-educacion.service';
import { NoticiasEducacion} from '../modelo/noticias-educacion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import * as moment from 'moment';


@Component({
  selector: 'appcolp-form-noticias-educacion',
  templateUrl: './form-noticias-educacion.component.html',
  styleUrls: ['./form-noticias-educacion.component.css']
})
export class FormNoticiasEducacionComponent implements OnInit {

  idnoticia: number | null = null;
  noticia: NoticiasEducacion | null = null;

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
  presentacion: string | null = null; // cambiar la presentacion de los registros, valores 'tabla' 'iconos'

  validacionFechas: boolean = true;
  imagenBoton: string = 'check-off-gris';
  enviarPUSH: boolean = false;
  noticiaSave: NoticiasEducacion | null = null;

  fechasInferior: boolean = false;

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  currentScreenSize: any = null;
  claseTamano: string = '';
  funciono: number;

  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;

  constructor(
    public service: NoticiasEducacionService,
    public servicePush: NotificacionService,
    private router: Router,
    private route: ActivatedRoute,
    breakpointObserver: BreakpointObserver
  ) {

    this.route
      .queryParamMap
      .subscribe(e => {
        this.idnoticia = parseInt(e.get('opc')); // parametro opc es el id de la alianza
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
    if (this.idnoticia != 0) {
      this.accion = 'editar'
      this.getNoticia();
    } else {
      this.accion = 'guardar'
      this.noticia = new NoticiasEducacion();
      this.noticia.estado =1;
    }
  }

  getNoticia() {
    this.service.getNoticia(this.idnoticia).subscribe(res => {
      console.log(res);
      this.noticia = res;
    }, err => {
      console.error(err);
    })
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'tituloNoticia') document.getElementById('spanTitulo').style.display = 'none';
    if (id == 'fechaInicialnoticia') document.getElementById('spanFechaInicialnoticia').style.display = 'none';
    if (id == 'resumen') document.getElementById('spanMensaje').style.display = 'none';
    if (id == 'url') document.getElementById('spanURL').style.display = 'none';
    if (id == 'inputPush') document.getElementById('spanInputPush').style.display = 'none';
    if (id == 'fechaInicialPush') document.getElementById('spanFechaInicialPush').style.display = 'none';
    if (id == 'fechaFinPush') document.getElementById('spanFechaFinPush').style.display = 'none';
  }


  abirCargaArchivo(event) {
    document.getElementById("uploadFile").click();
  }

  addFile(e) {
    let input = e.target as HTMLInputElement;
    let files = input.files;
    let idInput = input.id;
    this.file = files.item(0);
    if (this.file != null) {
      this.getBase64(this.file, idInput).then(data => {
        // console.log(data);
        let prueba = data.toString().split(',');
        this.noticia.imagen = prueba[1];
        document.getElementById('recuadro-excel').classList.remove('campo-vacio');
        document.getElementById('spanImagen').style.display = 'none';
      });
    }else{
      this.getBase64(this.file, idInput).then(data => {
        // console.log(data);
        let prueba = data.toString().split(',');
        this.noticia.imagen = prueba[1];
        document.getElementById('recuadro-excel').classList.remove('campo-vacio');
        document.getElementById('spanImagen').style.display = 'none';
      });
    }
  }

  getBase64(file, idInput) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let data = reader.result;
        let imagen = (document.getElementById(idInput) as HTMLImageElement);
        imagen.src = reader.result.toString();
        resolve(data);
      }
      reader.onerror = error => reject(error);
    })
  }

  validarLongitud(event) {
    let input = event.target as HTMLInputElement;
    if (input.id == 'tituloNoticia') {
      if (input.value.length == 100) { document.getElementById('spanTituloC').style.display = 'block'; }
      else if (input.value.length < 100) { document.getElementById('spanTituloC').style.display = 'none' }
    }
    if (input.id == 'descripcion') {
      if (input.value.length == 500) { document.getElementById('spanMensajeC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanMensajeC').style.display = 'none' }
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
    // if (this.idnoticia != 0) {
    //   this.getnoticia();
    // } else {
    //   this.noticia = new noticiaesBienestar();
    // }
    this.cuerpoNotificacion = new Notificacion();
    this.file = null;
    this.router.navigateByUrl('seccionEducacion', { skipLocationChange: true }).then(() => this.router.navigate(['seccionEducacion/noticias']));
  }


  recargar(){ 
    window.location.reload();
   }


  guardarCambios() {
    this.camposVacios = [];
    // debugger;

    // let etiqueta = document.getElementById('fechaInicialNoticia') as HTMLInputElement;
    // this.noticia.fechaNoticia = etiqueta.value;

    this.noticia.descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value;
    if (this.noticia.titulo == null || this.noticia.titulo == '' || this.noticia.titulo == undefined) this.camposVacios.push('titulo');
    if (this.noticia.fechaNoticia == null || this.noticia.fechaNoticia == '' || this.noticia.fechaNoticia == undefined) this.camposVacios.push('fechaInicio');
    if (this.noticia.descripcion == null || this.noticia.descripcion == '' || this.noticia.descripcion == undefined) this.camposVacios.push('descripcion');
    if (this.noticia.url == null || this.noticia.url == '' || this.noticia.url == undefined) this.camposVacios.push('url');
    
    if(this.enviarPUSH == true){
      if (this.contenidoPush == null || this.contenidoPush == '' || this.contenidoPush == undefined) this.camposVacios.push('inputPush');
      if (this.fechaInicio == null || this.fechaInicio == '' || this.fechaInicio == undefined) this.camposVacios.push('fechaInicialPush');
      if (this.fechaFin == null || this.fechaFin == '' || this.fechaFin == undefined) this.camposVacios.push('fechaFinPush');
    }
    // if (this.noticia.imagen==null){
    //   this.getBase64(this.file, idInput ).then(data => {
    //     // console.log(data);
    //     let prueba = data.toString().split(',');
    //     this.noticia.imagen = prueba[1];
    //     document.getElementById('recuadro-excel').classList.remove('campo-vacio');
    //     document.getElementById('spanImagen').style.display = 'none';
    //   });
    // } 
    // debugger

    if (this.camposVacios.length > 0) {
      this.camposObligatorios();
    } else {
      this.validacionFechas = true;
      if (this.enviarPUSH == true) {
        this.convertirFechas();
      }
      if (this.validacionFechas == true) {
        this.noticia.fechaNoticia = moment(this.noticia.fechaNoticia).format('YYYY-MM-DD')
        this.service.guardarCambios(this.noticia, this.accion).subscribe(res => {
          console.log(res);
          if (this.enviarPUSH == true) {
            let tituloMensajePush = '';
            if (this.accion == 'guardar') tituloMensajePush = "Sección educacion: Se agrego una nueva noticia"
            if (this.accion == 'editar') tituloMensajePush = "Sección educacion: Se modifico una noticia"
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
              if (this.accion == 'guardar') mensaje = "Se creo la noticia correctamente"
              if (this.accion == 'editar') mensaje = "Se modifico la noticia correctamente"
              this.alerta(mensaje, 1);
            }, err => {
              console.log(err);
              let mensaje = '';
              if (this.accion == 'guardar') mensaje = "Se creo la noticia correctamente, pero hubo un fallo enviando la notificación push"
              if (this.accion == 'editar') mensaje = "Se modifico la noticia correctamente, pero hubo un fallo enviando la notificación push"
              this.alerta(mensaje, 1);
            })
          }else{
            let mensaje = "";
            if (this.accion == 'guardar') mensaje = "Se creo la noticia correctamente"
            if (this.accion == 'editar') mensaje = "Se modifico la noticia correctamente"
            this.alerta(mensaje, 1);
          }
        }, err => {
          let mensaje = '';
          console.error(err)
          mensaje = "Ocurrio un fallo en la solicitud"
          this.alerta(mensaje, 0);
        })
      } else {
        let mensaje = `Rango de fechas no permitido.\n
        Tenga en cuenta las siguientes recomendaciones:\n
        1. La fecha inicial <b>No</b> puede ser menor a la fecha actual.
        2. La fecha final <b>debe</b> ser mayor a la fecha actual.
        3. la fecha inicial <b>No</b> puede ser mayor a la fecha final
        `;
        this.alerta(mensaje, 0);        
      }
    }
  }

  camposObligatorios() {
    // if (this.camposVacios.includes('imagen')) {
    //   document.getElementById('recuadro-excel').classList.add('campo-vacio');
    //   document.getElementById('spanImagen').style.display = 'block';
    // }
    if (this.camposVacios.includes('titulo')) {
      document.getElementById('tituloNoticia').classList.add('campo-vacio');
      document.getElementById('spanTitulo').style.display = 'block';
    }
    if (this.camposVacios.includes('descripcion')) {
      document.getElementById('descripcion').classList.add('campo-vacio');
      document.getElementById('spanMensaje').style.display = 'block';
    }
    if (this.camposVacios.includes('url')) {
      document.getElementById('url').classList.add('campo-vacio');
      document.getElementById('spanURL').style.display = 'block';
    }
    if (this.camposVacios.includes('fechaInicio')) {
      document.getElementById('fechaInicialNoticia').classList.add('campo-vacio');
      document.getElementById('spanFechaInicialNoticia').style.display = 'block';
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
    // debugger;
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

  alerta(message: string, valor: number) {
    this.switchModal = true;
    this.mensajeModal = message;
    this.funciono = valor;
  }
  
  cerrarModal() {
    this.switchModal = false;
    if (this.funciono == 1) {
      this.router.navigateByUrl('seccionEducacion', { skipLocationChange: true }).then(() => this.router.navigate(['seccionEducacion/noticias'])); 
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

  anadirImagen(){
    let imagen;
    if(this.accion == 'editar'){
      let type = 'image/png';
      const byteCharacters = atob(this.noticia.imagen);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: type});
      const imageFile: File = new File([blob], this.noticia.titulo, {
        type: "image/png"
      });
      imagen = window.URL.createObjectURL(imageFile);
    }else{
      imagen = "../assets/images/archivopac.png"
    }
    document.getElementById('imagen').setAttribute('src', imagen);
  }

  anadirFecha(etiqueta: HTMLInputElement){
    let valor = etiqueta.value;
    console.log(valor);
  }
  atras() {
    this.router.navigateByUrl('seccionEducacion', { skipLocationChange: true }).then(() => this.router.navigate(['seccionEducacion/noticias']));
  }
}