import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { exit } from 'process';
import { PageEvent } from '@angular/material';
import { NotificacionService } from '../servicios/notificaciones.service';
import { element } from '@angular/core/src/render3/instructions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { Notificacion } from '../modelo/notificacion';
import * as FileSaver from 'file-saver';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Usuario } from '../modelo/usuario';
import * as moment from 'moment';

import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
    // dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    // dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'appcolp-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class NotificacionesComponent implements OnInit {

  perfiles: any[];
  tipoNotificacion: number = 0;
  cuerpoNotificacion: Notificacion;
  modelPerfil: any = "";
  file: File | null = null;
  fileBase64: any;
  fileEstructura: File | null = null;
  camposVacios: any = [];
  // modal
  switchModal: boolean = false;
  mensajeModal: String = "";
  accion: String = "";
  // fin modal
  presentacion: string | null = null;

  numeroDocumento: boolean = true;

  fechasInferior: boolean = false;
  perfilSeleccionado: boolean = false;

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  currentScreenSize: any = null;
  claseTamano: string = '';

  usuarioLog: Usuario | null = null;

  validURL: boolean = true;

  constructor(
    public service: NotificacionService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    breakpointObserver: BreakpointObserver
  ) {
    this.usuarioLog = JSON.parse(localStorage.getItem('usuarioColp'));
    if (this.usuarioLog.colpRol.id != 1 && this.usuarioLog.colpRol.id != 6) this.router.navigate(['home']);
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

    this.cuerpoNotificacion = new Notificacion();
    this.service.listarPerfiles().subscribe(res => {
      this.perfiles = res;
      console.log(this.perfiles);
    }, error => {
      console.error(error);
    });
    this.tipoNotificacion = 0;
    this.fileEstructura = null;

  }

  ngOnInit() {
    this.cuerpoNotificacion = new Notificacion();
    this.tipoNotificacion = 0;
    this.fileEstructura = null;
  }

  guardar() {
    let envio;
    this.camposVacios = [];
    if (this.tipoNotificacion == 1) {
      if (this.cuerpoNotificacion.titulo == '' || this.cuerpoNotificacion.titulo == undefined) this.cuerpoNotificacion.titulo = '';
      if (this.cuerpoNotificacion.subtitulo == '' || this.cuerpoNotificacion.subtitulo == undefined) this.camposVacios.push('Mensaje');
      if (this.cuerpoNotificacion.fecha_inicio == '' || this.cuerpoNotificacion.fecha_inicio == undefined) this.camposVacios.push('Fecha inicial');
      if (this.cuerpoNotificacion.fecha_final == '' || this.cuerpoNotificacion.fecha_final == undefined) this.camposVacios.push('Fecha final');
      if (this.cuerpoNotificacion.tipoDocumento == '' || this.cuerpoNotificacion.tipoDocumento == undefined) this.camposVacios.push('Tipo documento');
      if (this.cuerpoNotificacion.numeroDocumento == '' || this.cuerpoNotificacion.numeroDocumento == undefined) this.camposVacios.push('Numero documento');
      envio = {
        "titulo": this.cuerpoNotificacion.titulo,
        "subtitulo": this.cuerpoNotificacion.subtitulo,
        "fecha_inicio": this.cuerpoNotificacion.fecha_inicio,
        "fecha_final": this.cuerpoNotificacion.fecha_final,
        "tipo": 2,
        "url": this.cuerpoNotificacion.url,
        "tipoDocumento": this.cuerpoNotificacion.tipoDocumento,
        "numeroDocumento": this.cuerpoNotificacion.numeroDocumento,
      }
      this.perfilSeleccionado = true;
    } else if (this.tipoNotificacion == 2) {
      if (this.cuerpoNotificacion.titulo == '' || this.cuerpoNotificacion.titulo == undefined) this.cuerpoNotificacion.titulo = '';
      if (this.cuerpoNotificacion.subtitulo == '' || this.cuerpoNotificacion.subtitulo == undefined) this.camposVacios.push('Mensaje');
      if (
        (this.cuerpoNotificacion.fecha_inicio == '' || this.cuerpoNotificacion.fecha_inicio == undefined) && this.perfilSeleccionado == true) this.camposVacios.push('Fecha inicial');
      if (this.cuerpoNotificacion.fecha_final == '' || this.cuerpoNotificacion.fecha_final == undefined) this.camposVacios.push('Fecha final');
      if (this.cuerpoNotificacion.perfil == null) {
        envio = {
          "titulo": this.cuerpoNotificacion.titulo,
          "subtitulo": this.cuerpoNotificacion.subtitulo,
          "fecha_inicio": this.cuerpoNotificacion.fecha_inicio,
          "fecha_final": this.cuerpoNotificacion.fecha_final,
          "tipo": 1,
          "url": this.cuerpoNotificacion.url,
        }
        this.perfilSeleccionado = false;
      } else {
        if (
          this.cuerpoNotificacion.perfil.id != null && this.cuerpoNotificacion.perfil.nombre != null && this.cuerpoNotificacion.perfil.perfil != null
        ) {
          envio = {
            "titulo": this.cuerpoNotificacion.titulo,
            "subtitulo": this.cuerpoNotificacion.subtitulo,
            "fecha_inicio": this.cuerpoNotificacion.fecha_inicio,
            "fecha_final": this.cuerpoNotificacion.fecha_final,
            "tipo": 2,
            "url": this.cuerpoNotificacion.url,
            "perfil": {
              "id": this.cuerpoNotificacion.perfil.id,
              "perfil": this.cuerpoNotificacion.perfil.perfil,
              "nombre": this.cuerpoNotificacion.perfil.nombre
            }
          }
          this.perfilSeleccionado = true;
        }
      }
    } else {
      this.camposVacios.push('Tipo notificacion');
    }
    if (this.camposVacios.length > 0) {
      this.camposObligatorios();
    } else {
      this.convertirFechas();
      envio.fecha_inicio = this.cuerpoNotificacion.fecha_inicio;
      envio.fecha_final = this.cuerpoNotificacion.fecha_final;
      if (this.validURL == false) {
        this.mensajeModal = "La url no es valida";
        this.accion = "error";
        this.switchModal = true;
      } else {
        if (this.fechasInferior == true) {
          this.mensajeModal = "Las fechas no pueden ser inferior a la fecha actual";
          this.accion = "error";
          this.switchModal = true;
        } else if (envio.fecha_inicio == null && this.perfilSeleccionado == false) {
          if (this.numeroDocumento == true) {
            this.service.guardar(envio).subscribe(res => {
              this.mensajeModal = "Se creo la notificación correctamente";
              this.accion = "guardar";
              this.switchModal = true;
            }, err => {
              this.mensajeModal = "Ocurrio un fallo";
              this.accion = "error";
              this.switchModal = true;
              console.error(err)
            });
          } else {
            this.mensajeModal = "El numero de documento no puede exceder el numero maximo de caracteres (Max. 15 caracteres)";
            this.accion = "error";
            this.switchModal = true;
          }
        } else if (envio.fecha_final > envio.fecha_inicio) {
          if (this.numeroDocumento == true) {
            this.service.guardar(envio).subscribe(res => {
              this.mensajeModal = "Se creo la notificación correctamente";
              this.accion = "guardar";
              this.switchModal = true;
            }, err => {
              this.mensajeModal = "Ocurrio un fallo";
              this.accion = "error";
              this.switchModal = true;
              console.error(err)
            });
          } else {
            this.mensajeModal = "El numero de documento no puede exceder el numero maximo de caracteres (Max. 15 caracteres)";
            this.accion = "error";
            this.switchModal = true;
          }
        } else if (envio.fecha_final == envio.fecha_inicio) {
          this.mensajeModal = "La fecha final no puede ser igual a la fecha inicial. Deben tener mínimo un día de diferencia";
          this.accion = "error";
          this.switchModal = true;
        } else if (envio.fecha_final < envio.fecha_inicio) {
          this.mensajeModal = "La fecha inicial no puede ser superior a la fecha final";
          this.accion = "error";
          this.switchModal = true;
        }
      }
    }
  }

  seleccionPerfil(event) {
    if (event.target.value != "") {
      this.perfiles.forEach(item => {
        if (item.id == event.target.value) {
          let { id, nombre, perfil } = item;
          this.cuerpoNotificacion.perfil = {
            id: parseInt(id),
            nombre: nombre,
            perfil: perfil.toString()
          }
          this.perfilSeleccionado = true;
        }
      })
    } else {
      this.cuerpoNotificacion.fecha_inicio = '';
      this.perfilSeleccionado = false;
      this.cuerpoNotificacion.perfil = {
        id: null,
        nombre: null,
        perfil: null
      }
    }
  }

  cancelar() {
    this.cuerpoNotificacion = new Notificacion();
    this.tipoNotificacion = 0;
    this.modelPerfil = "";
    this.file = null;
  }

  abirCargaArchivo(event) {
    document.getElementById("uploadFile").click();
  }

  addFile(files) {
    this.file = files.item(0);
    if (this.file != null) {
      this.getBase64(this.file).then(data => {
        this.fileBase64 = data;
        let sendFile = {
          "archivo": this.fileBase64
        }
        this.service.addFile(sendFile).subscribe(res => {
          this.mensajeModal = "Se envío el archivo adjunto correctamente";
          this.accion = "archivo";
          this.switchModal = true;
        }, err => {
          console.error(err)
          if (err.status == 200) {
            this.mensajeModal = "Se envío el archivo adjunto correctamente";
            this.accion = "archivo";
            this.switchModal = true;
          } else {
            this.mensajeModal = err.error;
            this.accion = "archivo";
            this.switchModal = true;
          }
        })
      });
    }
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let data = reader.result;
        resolve(data);
      }
      reader.onerror = error => reject(error);
    })
  }

  cambioTipo() {
    this.cuerpoNotificacion = new Notificacion();
    if(this.tipoNotificacion == 2){
      this.perfilSeleccionado = false;
    }
  }

  camposObligatorios() {
    if (this.camposVacios.includes('Tipo notificacion')) {
      document.getElementById('tipoNotificacion').classList.add('campo-vacio');
      document.getElementById('spanTipo').style.display = 'block';
    }
    if (this.camposVacios.includes('Titulo')) {
      document.getElementById('tituloNotificacion').classList.add('campo-vacio');
      document.getElementById('spanTitulo').style.display = 'block';
    }
    if (this.camposVacios.includes('Mensaje')) {
      document.getElementById('mensaje').classList.add('campo-vacio');
      document.getElementById('spanMensaje').style.display = 'block';
    }
    if (this.camposVacios.includes('Fecha inicial')) {
      document.getElementById('fechaInicial').classList.add('campo-vacio');
      document.getElementById('spanFechaInicial').style.display = 'block';
      // document.getElementById('spanFechas').style.display = 'block';
    }
    if (this.camposVacios.includes('Fecha final')) {
      document.getElementById('fechaFinal').classList.add('campo-vacio');
      document.getElementById('spanFechaFinal').style.display = 'block';
      // document.getElementById('spanFechas').style.display = 'block';
    }
    if (this.camposVacios.includes('Tipo documento')) {
      document.getElementById('tipoDocumento').classList.add('campo-vacio');
      document.getElementById('spanTipoCedula').style.display = 'block';
    }
    if (this.camposVacios.includes('Numero documento')) {
      document.getElementById('numeroDocumento').classList.add('campo-vacio');
      document.getElementById('spanNumero').style.display = 'block';
    }
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'tipoNotificacion') document.getElementById('spanTipo').style.display = 'none';
    if (id == 'tituloNotificacion') document.getElementById('spanTitulo').style.display = 'none';
    if (id == 'mensaje') document.getElementById('spanMensaje').style.display = 'none';
    if (id == 'fechaInicial') document.getElementById('spanFechaInicial').style.display = 'none';
    if (id == 'fechaFinal') document.getElementById('spanFechaFinal').style.display = 'none';
    if (id == 'tipoDocumento') document.getElementById('spanTipoCedula').style.display = 'none';
    if (id == 'numeroDocumento') document.getElementById('spanNumero').style.display = 'none';
  }

  validateURL(textval) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
  }

  convertirFechas() {
    // debugger;
    this.cuerpoNotificacion.fecha_inicio = this.cuerpoNotificacion.fecha_inicio != '' ? moment(this.cuerpoNotificacion.fecha_inicio).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');
    this.cuerpoNotificacion.fecha_final = moment(this.cuerpoNotificacion.fecha_final).format('YYYY-MM-DD')
    const Actual = new Date() // hoy
    let hoyS = moment(Actual).format('YYYY-MM-DD')
    const Hoy = new Date(hoyS);

    let fecha_inicio = new Date(this.cuerpoNotificacion.fecha_inicio);
    let fecha_final = new Date(this.cuerpoNotificacion.fecha_final);

    if (Hoy > fecha_inicio || Hoy >= fecha_final) this.fechasInferior = true;
    else this.fechasInferior = false;
  }

  cerrarModal() {
    this.switchModal = false;
    if (this.accion == "guardar" || this.accion == "archivo") {
      this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['notificaciones']));
    }
  }

  validarLongitud(event) {
    let input = event.target as HTMLInputElement;
    if (input.id == 'tituloNotificacion') {
      if (input.value.length == 50) { document.getElementById('spanTituloC').style.display = 'block'; }
      else if (input.value.length < 50) { document.getElementById('spanTituloC').style.display = 'none' }
    }
    if (input.id == 'numeroDocumento') {
      var code = (event.which) ? event.which : event.keyCode;
      if (input.value.length >= 15) {
        document.getElementById('spanNumeroC').style.display = 'block';
        this.numeroDocumento = false;
      }
      else if (input.value.length < 15) {
        document.getElementById('spanNumeroC').style.display = 'none'
        this.numeroDocumento = true;
      }
      if (code == 8) { // backspace.
        return true;
      } else { // other keys.
        if (code == 190) return false // punto
        if (code >= 48 && code <= 57) return true;// is a number.
        // if(code>=96 && code<=105) return true;// is a number.
        else return false; // other keys.
      }
    }
    if (input.id == 'mensaje') {
      if (input.value.length == 150) { document.getElementById('spanMensajeC').style.display = 'block'; }
      else if (input.value.length < 150) { document.getElementById('spanMensajeC').style.display = 'none' }
    }
    if (input.id == 'url') {
      if (input.value != '') {
        if (this.validateURL(input.value)) {
          document.getElementById('url').classList.remove('campo-vacio');
          document.getElementById('spanURLValid').style.display = 'none';
          this.validURL = true;
        }
        else {
          document.getElementById('url').classList.add('campo-vacio');
          document.getElementById('spanURLValid').style.display = 'block'
          this.validURL = false;
        }
      } else {
        document.getElementById('url').classList.remove('campo-vacio');
        document.getElementById('spanURLValid').style.display = 'none';
        this.validURL = true;
      }
      if (input.value.length == 500) { document.getElementById('spanURLC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanURLC').style.display = 'none' }
    }
  }

  atras() {
    this.router.navigateByUrl('notificaciones', { skipLocationChange: true }).then(() => this.router.navigate(['home']));
  }

  validarNumero($event){
    var code = ($event.which) ? $event.which : $event.keyCode;
    if (code >= 48 && code <= 57) return true;
    else return false
  }
}
