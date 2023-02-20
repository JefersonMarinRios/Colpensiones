import { Component, OnInit } from '@angular/core';
import { NotificacionService } from '../servicios/notificaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { EventosEducacionService } from '../servicios/eventos-educacion.service';
import { EventosEducacion } from '../modelo/eventos-educacion';
import { IdNombre, Departamento, Municipio, Region } from '../modelo/idNombre';
import { PersonaEventoEducacion } from '../modelo/persona-eventos-educacion';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'appcolp-form-eventos-educacion',
  templateUrl: './form-eventos-educacion.component.html',
  styleUrls: ['./form-eventos-educacion.component.css']
})
export class FormEventosEducacionComponent implements OnInit {

  selectedRegion: number = 0;
  selectedDepartamento: number = 0;
  selectedMunicipio: number = 0;
  regiones: IdNombre[] | null = null;
  departamentos: IdNombre[] | null = null;
  municipios: IdNombre[] | null = null;
  
  
  selectedTime: any; // Hora
  selectedTimeDate: any; // Hora


  idEvento: number | null = null;
  evento: EventosEducacion | null = null;
  personas: PersonaEventoEducacion[] | null = null;

  file: File | null = null;
  fileBase64: any;
  camposVacios: any = [];
  // modal
  switchModal: boolean = false;
  mensajeModal: String = ""; // mensaje modal alerta
  // fin modal

  // PUSH
  modalSwitch: boolean = false;
  contenidoPush: any = null;
  fechaInicio: any = null;
  fechaFin: any = null;
  enviarPUSH: boolean = false;
  // FIN PUSH
  
  accion: string | null = null
  presentacion: string | null = null;

  validacionFechas: boolean = true;
  imagenBoton: string = 'check-off-gris';
  eventoSave: EventosEducacion | null = null;

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
  boolAccion: boolean = false;

  constructor(
    public service: EventosEducacionService,
    public servicePush: NotificacionService,
    private router: Router,
    private route: ActivatedRoute,
    breakpointObserver: BreakpointObserver,
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
      this.getEvento().then(idMunicipio=>{
        this.service.listarLugares().subscribe(res=>{
          this.regiones = res.regiones;
          let departamentos: Departamento[] = res.departamentos;
          let municipios: Municipio[] = res.municipios;
          let municipioRegistro: Municipio;
          let departamentoRegistro: Departamento;

          municipios.forEach(e =>{
            if(e.id == idMunicipio) municipioRegistro = e;
          })

          this.municipios = municipios.filter(e =>{
            return e.id_departamento == municipioRegistro.id_departamento
          })

          departamentos.forEach(e =>{
            if(e.id == municipioRegistro.id_departamento) departamentoRegistro = e;
          })

          this.departamentos = departamentos.filter(e =>{
            return e.id_region == departamentoRegistro.id_region
          })
          this.selectedDepartamento = municipioRegistro.id_departamento;
          this.selectedRegion = departamentoRegistro.id_region;
        }, err=>{
          console.error(err)
        })
      });
    } else {
      this.accion = 'guardar'
      this.evento = new EventosEducacion();
      this.evento.municipio = new IdNombre();
      this.listarRegiones();
      let input = document.getElementById('departamento') as HTMLSelectElement;
      input.disabled = true;
  
      let input2 = document.getElementById('municipio') as HTMLSelectElement;
      input2.disabled = true;
    }
  }

  listarRegiones() {
    this.service.listarRegiones().subscribe(res => {
      this.regiones = res
    }, err => {
      console.error(err)
    });
  }

  cambiarSelects(id: string, disabled: boolean, value: string) {
    let input = document.getElementById(id) as HTMLSelectElement;
    input.disabled = disabled;
    input.value = value;
  }

  listarDepartamentos(id: number) {
    this.selectedDepartamento = 0;
    this.selectedMunicipio = 0;
    if (id == 0) {
      this.cambiarSelects('departamento', true, '0');
      this.cambiarSelects('municipio', true, '0');
    } else {
      this.service.listarDepartamentos(id).subscribe(res => {
        this.departamentos = res;
        this.cambiarSelects('departamento', false, '0');
        this.cambiarSelects('municipio', true, '0');
      }, err => {
        console.error(err)
        this.cambiarSelects('departamento', true, '0');
        this.cambiarSelects('municipio', true, '0');
      });
    }
  }

  listarMunicipios(id: number) {
    this.selectedMunicipio = 0;
    this.service.listarMunicipios(id).subscribe(res => {
      this.municipios = res
      
      this.cambiarSelects('municipio', false, '0');
    }, err => {
      console.error(err)
      this.cambiarSelects('municipio', true, '0');
    });
  }

  getEvento() {
    return new Promise((resolve, reject) => {
      this.service.listarEventoId(this.idEvento).subscribe(res => {
        this.evento = res; // Se añade la respuesta al evento
        // Algoritmo para sacar la hora en el formato necesario para que no genere fallos el modulo al iniciar
        let array1 = this.evento.hora.split(" "); 
        let array2 = array1[1].split(':'); 
        this.selectedTime = array2[0] + ':' + array2[1]; 
        let inputHora = document.getElementById('inputHoraEvento') as HTMLInputElement;
        inputHora.value = this.selectedTime;
        // Fin algoritmo de hora
        
        // Algoritmo para traer la fecha
        this.selectedTimeDate = moment(this.evento.fechaInicio).format('MM/DD/YYYY');
        console.log("fecha inicio del evento");
        console.log(this.selectedTimeDate)

        // Fin alforitmo fecha

        this.selectedMunicipio = this.evento.municipio.id;
        resolve(this.selectedMunicipio);
      }, err => {
        console.error(err);
        reject(err);
      })
      
    })
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'nombreEvento') document.getElementById('spanTitulo').style.display = 'none';
    if (id == 'fechaInicialEvento') document.getElementById('spanFechaInicialEvento').style.display = 'none';
    if (id == 'inputHoraEvento') document.getElementById('spanHoraEvento').style.display = 'none';
    if (id == 'resumen') document.getElementById('spanMensaje').style.display = 'none';
    if (id == 'url') document.getElementById('spanURL').style.display = 'none';
    if (id == 'direccion') document.getElementById('spanDir').style.display = 'none';
    if (id == 'inputPush') document.getElementById('spanInputPush').style.display = 'none';
    if (id == 'fechaInicialPush') document.getElementById('spanFechaInicialPush').style.display = 'none';
    if (id == 'fechaFinPush') document.getElementById('spanFechaFinPush').style.display = 'none';
    if (id == 'region') document.getElementById('spanRegion').style.display = 'none';
    if (id == 'municipio') document.getElementById('spanMunicipio').style.display = 'none';
    if (id == 'departamento') document.getElementById('spanDepartamento').style.display = 'none';
  }

  removeClassTime(e) {
    e.targetElement.classList.remove('campo-vacio');
    let id = e.targetElement.id;
    if (id == 'fechaInicialEvento') document.getElementById('spanFechaInicialEvento').style.display = 'none';
    if (id == 'fechaInicialPush') document.getElementById('spanFechaInicialPush').style.display = 'none';
    if (id == 'fechaFinPush') document.getElementById('spanFechaFinPush').style.display = 'none';
  }

  removeClassHour(e) {
    let element = document.getElementById('inputHoraEvento') as HTMLInputElement;
    element.classList.remove('campo-vacio')
    document.getElementById('spanHoraEvento').style.display = 'none';
    // this.evento.hora = (document.getElementById('inputHoraEvento') as HTMLInputElement).value;
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
        let prueba = data.toString().split(',');
        this.evento.imagen = prueba[1];
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
    if (input.id == 'nombreEvento') {
      if (input.value.length == 100) { document.getElementById('spanTituloC').style.display = 'block'; }
      else if (input.value.length < 100) { document.getElementById('spanTituloC').style.display = 'none' }
    }
    if (input.id == 'resumen') {
      if (input.value.length == 500) { document.getElementById('spanMensajeC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanMensajeC').style.display = 'none' }
    }
    if (input.id == 'direccion') {
      if (input.value.length == 100) { document.getElementById('spanDirC').style.display = 'block'; }
      else if (input.value.length < 100) { document.getElementById('spanDirC').style.display = 'none' }
    }
    if (input.id == 'url') {
      if (input.value.length == 500) { document.getElementById('spanURLC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanURLC').style.display = 'none' }
    }
    if (this.enviarPUSH == true) {
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
    this.file = null;
    this.router.navigateByUrl("seccionEducacion", { skipLocationChange: true }).then(() => {
      this.router.navigate(['seccionEducacion/evento'], { queryParams: {opc: this.idEvento}});
    });
  }

  guardarCambios() {
    this.camposVacios = [];
    if(this.idEvento == 0){
      this.evento.resumen = (document.getElementById('resumen') as HTMLTextAreaElement).value;
      this.evento.url = (document.getElementById('url') as HTMLTextAreaElement).value;
      this.evento.hora = (document.getElementById('inputHoraEvento') as HTMLInputElement).value;
      this.evento.fechaInicio = (document.getElementById('fechaInicialEvento') as HTMLInputElement).value;
      this.selectedTime = this.evento.hora;
      // this.evento.hora = this.selectedTime;
    }
    debugger;

    if (this.evento.nombre == null || this.evento.nombre == '' || this.evento.nombre == undefined) this.camposVacios.push('titulo');
    if (this.evento.fechaInicio == null || this.evento.fechaInicio == '' || this.evento.fechaInicio == undefined) this.camposVacios.push('fechaInicio');
    if (this.evento.hora == null || this.evento.hora == '' || this.evento.hora == undefined) this.camposVacios.push('hora');
    if (this.evento.resumen == null || this.evento.resumen == '' || this.evento.resumen == undefined) this.camposVacios.push('resumen');
    if (this.evento.url == null || this.evento.url == '' || this.evento.url == undefined) this.camposVacios.push('url');
    if (this.evento.direccion == null || this.evento.direccion == '' || this.evento.direccion == undefined) this.camposVacios.push('direccion');
    if (this.selectedRegion == null || this.selectedRegion == 0 || this.selectedRegion == undefined) this.camposVacios.push('region');
    if (this.selectedDepartamento == null || this.selectedDepartamento == 0 || this.selectedDepartamento == undefined) this.camposVacios.push('departamento');
    if (this.selectedMunicipio == null || this.selectedMunicipio == 0 || this.selectedMunicipio == undefined) this.camposVacios.push('municipio');

    if (this.enviarPUSH == true) {
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
        // this.evento.hora = moment(this.evento.hora).add(moment.duration(this.selectedTime)).format('YYYY-MM-DD HH:mm:ss');
        this.evento.hora = moment(this.evento.fechaInicio).add(moment.duration(this.selectedTime)).format('YYYY-MM-DD HH:mm:ss');
        this.evento.fechaInicio = moment(this.evento.fechaInicio).format('YYYY-MM-DD')
        this.evento.municipio.id = this.selectedMunicipio;
        this.service.guardarCambios(this.evento, this.accion).subscribe(res => {
          console.log(res);
          if (this.enviarPUSH == true) {
            let tituloMensajePush = '';
            if (this.accion == 'guardar') tituloMensajePush = "Sección Educacion: Se agrego un nuevo evento"
            if (this.accion == 'editar') tituloMensajePush = "Sección Educacion: Se modifico un evento"
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
              if (this.accion == 'guardar') mensaje = "Se creo el evento correctamente"
              if (this.accion == 'editar') mensaje = "Se modifico el evento correctamente"
              this.boolAccion = true;
              this.alerta(mensaje);
            }, err => {
              console.error(err);
              let mensaje = '';
              if (this.accion == 'guardar') mensaje = "Se creo el evento correctamente, pero hubo un fallo enviando la notificación push"
              if (this.accion == 'editar') mensaje = "Se modifico el evento correctamente, pero hubo un fallo enviando la notificación push"
              this.boolAccion = false;
              this.alerta(mensaje);
            })
          } else {
            let mensaje = "";
            if (this.accion == 'guardar') mensaje = "Se creo el evento correctamente"
            if (this.accion == 'editar') mensaje = "Se modifico el evento correctamente"
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
    if (this.camposVacios.includes('direccion')) {
      document.getElementById('direccion').classList.add('campo-vacio');
      document.getElementById('spanDir').style.display = 'block';
    }
    if (this.camposVacios.includes('url')) {
      document.getElementById('url').classList.add('campo-vacio');
      document.getElementById('spanURL').style.display = 'block';
    }
    if (this.camposVacios.includes('fechaInicio')) {
      document.getElementById('fechaInicialEvento').classList.add('campo-vacio');
      document.getElementById('spanFechaInicialEvento').style.display = 'block';
    }
    if (this.camposVacios.includes('hora')) {
      document.getElementById('inputHoraEvento').classList.add('campo-vacio');
      document.getElementById('spanHoraEvento').style.display = 'block';
    }
    if (this.camposVacios.includes('region')) {
      document.getElementById('region').classList.add('campo-vacio');
      document.getElementById('spanRegion').style.display = 'block';
    }
    if (this.camposVacios.includes('departamento')) {
      document.getElementById('departamento').classList.add('campo-vacio');
      document.getElementById('spanDepartamento').style.display = 'block';
    }
    if (this.camposVacios.includes('municipio')) {
      document.getElementById('municipio').classList.add('campo-vacio');
      document.getElementById('spanMunicipio').style.display = 'block';
    }

    if (this.enviarPUSH == true) {
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
    let diaActual = fechaActual.getDate() < 9 ? '0' + fechaActual.getDate() : fechaActual.getDate();
    let mesActual = fechaActual.getMonth() < 9 ? '0' + (fechaActual.getMonth() + 1) : fechaActual.getMonth() + 1;
    let fechaActualString = fechaActual.getFullYear().toString() + '/' + mesActual.toString() + '/' + diaActual.toString();
    fechaActual = new Date(fechaActualString)
    let fechaUno = new Date((document.getElementById('fechaInicialPush') as HTMLInputElement).value);
    let fechaDos = new Date((document.getElementById('fechaFinPush') as HTMLInputElement).value);

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
    if (this.boolAccion == true) {
      this.router.navigateByUrl('seccionEducacion', { skipLocationChange: true }).then(() => this.router.navigate(['seccionEducacion/eventos']));
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
      const byteCharacters = atob(this.evento.imagen);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: type });
      const imageFile: File = new File([blob], this.evento.nombre, {
        type: "image/png"
      });
      imagen = window.URL.createObjectURL(imageFile);
    } else {
      imagen = "../assets/images/archivopac.png"
    }
    document.getElementById('imagen').setAttribute('src', imagen);
  }

  /************** Exportar Excel ****************** */

  exportarExcel(id: number) {
    this.service.listarPersonas(id).subscribe((res) => {
      this.personas = res;
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.personas);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      XLSX.writeFile(workbook, 'parametros.xls', { bookType: 'xls', type: 'buffer' });
    });
  }
  atras() {
    this.router.navigateByUrl('seccionEducacion', { skipLocationChange: true }).then(() => this.router.navigate(['seccionEducacion/eventos']));
  }

}


