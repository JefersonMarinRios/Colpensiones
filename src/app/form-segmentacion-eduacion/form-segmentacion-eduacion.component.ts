import { Component, OnInit } from '@angular/core';
import { NotificacionService } from '../servicios/notificaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Notificacion } from '../modelo/notificacion';
import { SegmentacionEducacionService } from '../servicios/segmentacion-educacion.service';
import { SegmentacionEducacion } from '../modelo/segmentacion-educacion';

@Component({
  selector: 'appcolp-form-segmentacion-eduacion',
  templateUrl: './form-segmentacion-eduacion.component.html',
  styleUrls: ['./form-segmentacion-eduacion.component.css']
})
export class FormSegmentacionEduacionComponent implements OnInit {
  idSegmentacion: number | null = null;
  segmentacion: SegmentacionEducacion | null = null;
  segmentaciones: SegmentacionEducacion[] | null = null;

  cuerpoNotificacion: Notificacion;
  file: File | null = null;
  fileBase64: any;
  camposVacios: any = [];
  // modal
  switchModal: boolean = false;
  mensajeModal: String = ""; // mensaje modal alerta
  // fin modal

  presentacion: string | null = null;

  modalSwitch: boolean = false;
  contenidoPush: any = null;
  fechaInicio: any = null;
  fechaFin: any = null;
  accion: string | null = null

  validacionFechas: boolean = true;
  imagenBoton: string = 'check-off-gris';
  enviarPUSH: boolean = false;
  segmentacionSave: SegmentacionEducacionService | null = null;

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
  funciona: number;

  constructor(
    public service: SegmentacionEducacionService,
    public servicePush: NotificacionService,
    private router: Router,
    private route: ActivatedRoute,
    breakpointObserver: BreakpointObserver
  ) {
    this.route
      .queryParamMap
      .subscribe(e => {
        this.idSegmentacion = parseInt(e.get('opc')); // parametro opc es el id de la alianza
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
    this.presentacion = 'iconos'
    if (this.idSegmentacion != 0) {
      this.accion = 'editar'
      this.getSegmentacion();
    } else {
      this.accion = 'guardar'
      this.segmentacion = new SegmentacionEducacion();
      this.segmentacion.estado = 1;
    }
  }

  getSegmentacion() {
    this.service.listarSegmentaciones().subscribe(res => {
      this.segmentaciones = res;
      this.segmentaciones.forEach(e => {
        if (e.id == this.idSegmentacion) {
          this.segmentacion = e;
        }
      })
    }, err => { console.error(err) })


  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'titulo') document.getElementById('spanTitulo').style.display = 'none';
    if (id == 'urlSegmento') document.getElementById('spanURL').style.display = 'none';
  }


  abirCargaArchivo(event) {
    document.getElementById("uploadFile").click();
  }

  addFile(e) {
    let input = e.target as HTMLInputElement;
    let files = input.files;
    let idInput = 'imagen';
    this.file = files.item(0);
    if (this.file != null) {
      this.getBase64(this.file, idInput).then(data => {
        let prueba = data.toString().split(',');
        this.segmentacion.imagen = prueba[1];
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
    if (input.id == 'titulo') {
      if (input.value.length == 50) { document.getElementById('spanTituloC').style.display = 'block'; }
      else if (input.value.length < 50) { document.getElementById('spanTituloC').style.display = 'none' }
    }
    if (input.id == 'urlSegmento') {
      if (input.value.length == 500) { document.getElementById('spanURLC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanURLC').style.display = 'none' }
    }
  }

  atras() {
    this.cuerpoNotificacion = new Notificacion();
    this.file = null;
    this.router.navigateByUrl('seccionEducacion', { skipLocationChange: true }).then(() => this.router.navigate(['seccionEducacion/segmentaciones']));
  }

  cancelar() {
    window.location.reload();
  }

  guardarCambios() {
    this.camposVacios = [];

    if (this.segmentacion.imagen == null || this.segmentacion.imagen == '' || this.segmentacion.imagen == undefined) this.camposVacios.push('imagen');
    if (this.segmentacion.titulo == null || this.segmentacion.titulo == '' || this.segmentacion.titulo == undefined) this.camposVacios.push('titulo');
    if (this.segmentacion.urlSegmento == null || this.segmentacion.urlSegmento == '' || this.segmentacion.urlSegmento == undefined) this.camposVacios.push('urlSegmento');

    if (this.camposVacios.length > 0) {
      this.camposObligatorios();
    } else {
      this.validacionFechas = true;
      if (this.validacionFechas == true) {
        this.service.guardarCambios(this.segmentacion, this.accion).subscribe(res => {
          console.log(res);
          if (this.enviarPUSH == true) {
            let tituloMensajePush = '';
            if (this.accion == 'guardar') tituloMensajePush = "Sección Segmentacion: Se agregó un nuevo segmento"
            if (this.accion == 'editar') tituloMensajePush = "Sección Segmentacion: Se modificó un segmento"
            let envio = {
              "titulo": tituloMensajePush,
              "subtitulo": this.contenidoPush,
              "fecha_final": this.fechaFin,
              "tipo": 1,
              "url": '',
            }
            this.servicePush.guardar(envio).subscribe(res => {
              let mensaje = '';
              if (this.accion == 'guardar') mensaje = "Se creó el segmento correctamente"
              if (this.accion == 'editar') mensaje = "Se modificó el segmento correctamente"
              this.alerta(mensaje, 1);


            }, err => {
              console.log(err);
              let mensaje = '';
              if (this.accion == 'guardar') mensaje = "Se creo el segmento correctamente, pero hubo un fallo enviando la notificación push"
              if (this.accion == 'editar') mensaje = "Se modifico el segmentacion correctamente, pero hubo un fallo enviando la notificación push"
              this.alerta(mensaje, 1);
            })
          } else {
            let mensaje = "";
            if (this.accion == 'guardar') mensaje = "Se creó el segmento correctamente"
            if (this.accion == 'editar') mensaje = "Se modificó el segmento correctamente"
            this.alerta(mensaje, 1);

          }
        }, err => {
          let mensaje = '';
          console.error(err)
          mensaje = "Ocurrió un fallo en la solicitud"
          this.alerta(mensaje, 0);
        })
      } else {
        let mensaje = `Rango de fechas no permitido.\n
        Tenga en cuenta las siguientes recomendaciones:\n
        1. La fecha inicial No puede ser menor a la fecha actual.
        2. La fecha final debe ser mayor a la fecha actual.
        3. la fecha inicial No puede ser mayor a la fecha final
        `;

        this.alerta(mensaje, 0);
      }
    }

  }

  camposObligatorios() {

    if (this.camposVacios.includes('titulo')) {
      document.getElementById('titulo').classList.add('campo-vacio');
      document.getElementById('spanTitulo').style.display = 'block';
    }
    if (this.camposVacios.includes('urlSegmento')) {
      document.getElementById('urlSegmento').classList.add('campo-vacio');
      document.getElementById('spanURL').style.display = 'block';
    }
    if (this.camposVacios.includes('imagen')) {
      document.getElementById('recuadro-excel').classList.add('campo-vacio');
      document.getElementById('spanImagen').style.display = 'block';
    }
    if (this.camposVacios.includes('uploadFile')) {
      document.getElementById('uploadFile').classList.add('campo-vacio');
      document.getElementById('spanImagen').style.display = 'block';
    }
    
  }

  alerta(message: string, valor: number) {
    this.switchModal = true;
    this.mensajeModal = message;
    this.funciona = valor;

  }

  cerrarModal() {
    this.switchModal = false;
    if (this.funciona == 1) {
      this.router.navigateByUrl('seccionEducacion', { skipLocationChange: true }).then(() => this.router.navigate(['seccionEducacion/segmentaciones']));
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

  anadirImagen() {
    let imagen;
    if (this.accion == 'editar') {
      let type = 'image/png';
      const byteCharacters = atob(this.segmentacion.imagen);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: type });
      const imageFile: File = new File([blob], this.segmentacion.titulo, {
        type: "image/png"
      });
      imagen = window.URL.createObjectURL(imageFile);
    } else {
      imagen = "../assets/images/archivopac.png"
    }
    document.getElementById('imagen').setAttribute('src', imagen);
  }
  cambiarPresentacion(presentacion: string) {
    this.presentacion = presentacion;
  }

}
