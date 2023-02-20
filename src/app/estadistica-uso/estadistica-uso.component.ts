import { Component, OnInit, Input, NgZone, ViewChild, HostListener } from '@angular/core';
import * as _moment from 'moment';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EstadisticasusoService } from '../servicios/estadisticasuso.service';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'appcolp-estadistica-uso',
  templateUrl: './estadistica-uso.component.html',
  styleUrls: ['./estadistica-uso.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ],
  providers: [],
  // { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  //   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  //   DatePipe
})

export class EstadisticaUsoComponent implements OnInit {

  // Declarar atributos (variables) del componente
  // Fechas
  fechaActualDate: Date = new Date(); // Fecha actual en formato Date
  fechaActual: string; // Fecha actual en formato yyyy-mm-dd
  inicioMes: string; // Dato inicio de mes en formato yyyy-mm-dd
  fechaInicio: string; // Fecha inicio en formato yyyy-mm-dd --> Filtro del front
  fechaFinal: string; // Fecha final en formato yyyy-mm-dd --> Filtro del front
  // Fin Fechas

  // servicioFiltrado: any = null; // Filtro por servicio
  servicioFiltrado: number[] = []; // Filtro por servicio

  // Datos
  listaServicios: any = []; // lista de los servicios 
  listaServiciosFiltro: any = []; // lista de los servicios 
  mayorPoblacion: number = null; // Dato que nos defime el volumen mas alto
  listaExcel: any = [];
  // Fin Datos

  // Paginacion
  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  pageSize: number = 100;
  desde: number = 0;
  hasta: number = 100;
  // Fin paginacion

  // Otros
  color: String = 'azul'; // Color grafica valores =  [verde, rojo]
  contadores: any = [];
  porcentaje: number = null;
  dropdownSettings: IDropdownSettings = {};
  // Fin otros
  switchModalFiltro: boolean = false;

  alertaFechas: boolean = false;
  mensajeAlertaFechas: string | null = '';

  constructor(
    private estadisticadeUsoService: EstadisticasusoService, // Definir servicio de estadistica // clase = EstadisticasusoService
    private router: Router // enrutador 
  ) {
    let diaActual = this.fechaActualDate.getDate() <= 9 ? '0' + this.fechaActualDate.getDate() : this.fechaActualDate.getDate()
    let mesActual = this.fechaActualDate.getMonth() < 9 ? '0' + (this.fechaActualDate.getMonth() + 1).toString() : this.fechaActualDate.getMonth() + 1; // Definir el inicio del mes actual
    this.fechaActual = this.fechaActualDate.getFullYear().toString() + '-' + mesActual.toString() + '-' + diaActual.toString(); // Define la fecha actual en formato yyyy-mm-dd
    this.inicioMes = this.fechaActualDate.getFullYear().toString() + '-' + mesActual.toString() + '-01'; // Define el inicio del mes actual en en formato yyyy-mm-dd
    this.fechaInicio = this.inicioMes;
    this.fechaFinal = this.fechaActual;
    this.switchModalFiltro = false;
  }

  ngOnInit() {
    // this.listarXFechas(this.inicioMes, this.fechaActual); // Descomentariar cuando se tenga listo el modulo 
    this.listarTodo();
    this.listarXFechas('2020-01-01', this.fechaActual); // Descomentariar en desarrollo
    // this.resetTimer();
    this.dropdownSettings = {
      idField: 'id',
      textField: 'nombre',
    };
  }

  listarTodo() { // Trae todos los datos
    this.estadisticadeUsoService.listarTodo().subscribe(res => {
      this.listaServiciosFiltro = res; // Se llena arreglo de servicios para el filtro
    }, err => console.log(err))
  }

  listarXFechas(fechaInicial, fechaFinal) { // funcion que consume el servicio que trae los datos en base al rango de fechas que se le pase
    let fechas;
    let direccion = "";
    if (this.servicioFiltrado != null && this.servicioFiltrado.length != 0) {
      fechas = {
        "fechaFinal": fechaFinal,
        "fechaInicial": fechaInicial,
        "id": this.servicioFiltrado
      } // Cuerpo de la peticion
      direccion = 'listarServicio'
    } else {
      fechas = {
        "fechaFinal": fechaFinal,
        "fechaInicial": fechaInicial
      } // Cuerpo de la peticion
      direccion = 'listarTodo'
    }
    this.mayorPoblacion = null;
    this.estadisticadeUsoService.datosXFecha(fechas, direccion).subscribe(res => { // envio y procesamiento de la peticion
      this.contadores = [];
      this.listaServicios = res;
      this.listaServicios.forEach(element => { // bucle para sacar el elemento con mayor valor 
        if (this.mayorPoblacion == null) { // Si el atributo es nulo se le asigna // primera iteracion del bucle
          this.mayorPoblacion = parseInt(element.cantidad) // Se asigna el valor 
        } else { // segunda iteracion o superior
          this.mayorPoblacion = this.mayorPoblacion < parseInt(element.cantidad) ? parseInt(element.cantidad) : this.mayorPoblacion; // Se asigna el valor 
        }
      });
      // el siguiente bloque de codigo crea la tabla de valores inferior 
      let valor = Math.trunc(this.mayorPoblacion / 5); // se divide el numero por 5 para sacar los labels
      let acomulador = valor; // variable acumuladora 
      this.contadores.push(valor); // se le asigna al arreglo de contadores
      for (let i = 0; i < 3; i++) { // bucle para llenar las posiciones 1 y 2 del arreglo
        acomulador = acomulador + valor; // acumula el valor que tiene mas el numero sacado de la divicion
        this.contadores.push(acomulador); // se le asigna al arreglo de contadores
      }
      this.servicioFiltrado = []
    }, err => console.error(err))
  }

  cambiarColor() {
    this.color = this.color == 'verde' ? 'azul' : 'verde'; // se intercambian los colores
  }

  cambiarPorcentaje(element) { // funcion para darle los tamaños correspondientes a cada una de las barras de los items
    // this.listaServicios.forEach(element => { // se recorre lista
    let valorPorcentaje = (element.cantidad * 100) / this.mayorPoblacion; // se saca su valor porcentual
    document.getElementById('div' + element.id).style.width = valorPorcentaje + '%'; // se le asigna el valor porcentual al elemento
    document.getElementById('div' + element.id).style.height = '25px'; // se le asigna el valor porcentual al elemento
    // });

  }

  limpiarFiltros() {
    this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['uso']));
  }

  filtrar() {
    let inputFechaUno = (document.getElementById('filtroFechaInicio') as HTMLInputElement).value
    let inputFechaDos = (document.getElementById('filtroFechaFinal') as HTMLInputElement).value

    this.convertirFechas(inputFechaUno, inputFechaDos)
    
    if(this.alertaFechas == false){
      this.switchModalFiltro = false;
      this.listarXFechas(this.fechaInicio.toString(), this.fechaFinal.toString());
    }
  }

  convertirFechas(fechaInicial, fechaFinal) {
    
    let dateInicio, dateFinal;
    const Hoy = new Date();
    this.alertaFechas = false;
    if (
      (fechaInicial == '' || fechaInicial == null || fechaInicial == undefined) &&
      (fechaFinal == '' || fechaFinal == null || fechaFinal == undefined)
    ) {  // listar el mes actual
        this.fechaFinal = moment(Hoy).format('YYYY-MM-DD')
        let date = new Date(Hoy.getFullYear(), Hoy.getMonth(), 1)
        this.fechaInicio = moment(date).format('YYYY-MM-DD')
    } else {
      if (
        (fechaInicial !== '' && fechaInicial !== null && fechaInicial !== undefined) &&
        (fechaFinal == '' || fechaFinal == null || fechaFinal == undefined)
      ) {
        fechaFinal = new Date();
        this.fechaInicio = moment(fechaInicial).format('YYYY-MM-DD')
        this.fechaFinal = moment(fechaFinal).format('YYYY-MM-DD')
      }

      if (
        (fechaInicial == '' || fechaInicial == null || fechaInicial == undefined) &&
        (fechaFinal !== '' && fechaFinal !== null && fechaFinal !== undefined)
      ) {
        this.fechaFinal = moment(fechaFinal).format('YYYY-MM-DD')
        let date = new Date(fechaFinal)
        let date2 = new Date(date.getFullYear(), date.getMonth(), 1)
        this.fechaInicio = moment(date2).format('YYYY-MM-DD')
      }

      if (
        (fechaInicial !== '' && fechaInicial !== null && fechaInicial !== undefined) &&
        (fechaFinal !== '' && fechaFinal !== null && fechaFinal !== undefined)
      ) {
        this.fechaInicio = moment(fechaInicial).format('YYYY-MM-DD')
        this.fechaFinal = moment(fechaFinal).format('YYYY-MM-DD')
      }

      dateInicio = new Date(this.fechaInicio)
      dateFinal = new Date(this.fechaFinal)
      console.log(dateInicio);
      console.log(dateFinal);

      if (dateInicio > Hoy || dateFinal > Hoy) {
        this.alertaFechas = true;
        this.mensajeAlertaFechas = "Las fechas no pueden ser mayor a la fecha actual"
      }else if (dateInicio > dateFinal) {
        this.alertaFechas = true;
        this.mensajeAlertaFechas = "La fecha inicial no puede ser mayor a la fecha final"
      }
    }
  }



  /*
  let fechaUno, fechaDos, diaUno, diaDos, mesUno, mesDos;

    if(
      (inputFechaUno.value == '' || inputFechaUno.value == null || inputFechaUno.value == undefined) &&
      (inputFechaDos.value == '' || inputFechaDos.value == null || inputFechaDos.value == undefined)
      ){
        fechaDos = new Date();
        diaDos = fechaDos.getDate() <= 9 ? '0' + fechaDos.getDate() : fechaDos.getDate();
        mesDos = fechaDos.getMonth() < 9 ? '0' + (fechaDos.getMonth() + 1).toString() : fechaDos.getMonth() + 1;
        this.fechaFinal = fechaDos.getFullYear().toString() + '-' + mesDos.toString() + '-' + diaDos.toString();
        this.fechaInicio = fechaDos.getFullYear().toString() + '-' + mesDos.toString() + '- 01';
    }
    if(
      (inputFechaUno.value !== '' && inputFechaUno.value !== null && inputFechaUno.value !== undefined) &&
      (inputFechaDos.value == '' || inputFechaDos.value == null || inputFechaDos.value == undefined)
      ){
        fechaDos = new Date();
        fechaUno = new Date(inputFechaUno.value)
        // Sacar el dia
        let diaUno = fechaUno.getDate() <= 9 ? '0' + fechaUno.getDate() : fechaUno.getDate();
        let diaDos = fechaDos.getDate() <= 9 ? '0' + fechaDos.getDate() : fechaDos.getDate();
        // Sacar el mes
        let mesUno = fechaUno.getMonth() < 9 ? '0' + (fechaUno.getMonth() + 1).toString() : fechaUno.getMonth() + 1;
        let mesDos = fechaDos.getMonth() < 9 ? '0' + (fechaDos.getMonth() + 1).toString() : fechaDos.getMonth() + 1;
        // Construir la fecha a String
        this.fechaInicio = fechaUno.getFullYear().toString() + '-' + mesUno.toString() + '-' + diaUno.toString();
        this.fechaFinal = fechaDos.getFullYear().toString() + '-' + mesDos.toString() + '-' + diaDos.toString();
      }
    if(
      (inputFechaUno.value == '' || inputFechaUno.value == null || inputFechaUno.value == undefined) &&
      (inputFechaDos.value !== '' && inputFechaDos.value !== null && inputFechaDos.value !== undefined)
    ){
      fechaDos = new Date(inputFechaDos.value);
      diaDos = fechaDos.getDate() <= 9 ? '0' + fechaDos.getDate() : fechaDos.getDate();
      mesDos = fechaDos.getMonth() < 9 ? '0' + (fechaDos.getMonth() + 1).toString() : fechaDos.getMonth() + 1;
      this.fechaFinal = fechaDos.getFullYear().toString() + '-' + mesDos.toString() + '-' + diaDos.toString();
      this.fechaInicio = fechaDos.getFullYear().toString() + '-' + mesDos.toString() + '- 01';
    }
    if(
      (inputFechaUno.value !== '' && inputFechaUno.value !== null && inputFechaUno.value !== undefined) &&
      (inputFechaDos.value !== '' && inputFechaDos.value !== null && inputFechaDos.value !== undefined)
    ){
      fechaDos = new Date(inputFechaDos.value);
      fechaUno = new Date(inputFechaUno.value)
      // Sacar el dia
      let diaUno = fechaUno.getDate() <= 9 ? '0' + fechaUno.getDate() : fechaUno.getDate();
      let diaDos = fechaDos.getDate() <= 9 ? '0' + fechaDos.getDate() : fechaDos.getDate();
      // Sacar el mes
      let mesUno = fechaUno.getMonth() < 9 ? '0' + (fechaUno.getMonth() + 1).toString() : fechaUno.getMonth() + 1;
      let mesDos = fechaDos.getMonth() < 9 ? '0' + (fechaDos.getMonth() + 1).toString() : fechaDos.getMonth() + 1;
      // Construir la fecha a String
      this.fechaInicio = fechaUno.getFullYear().toString() + '-' + mesUno.toString() + '-' + diaUno.toString();
      this.fechaFinal = fechaDos.getFullYear().toString() + '-' + mesDos.toString() + '-' + diaDos.toString();
    }

    // console.log('******************');
    // console.log('Fecha inicio: '+this.fechaInicio);
    // console.log('Fecha fin: '+this.fechaFinal);
    // console.log('******************');
  */

  exportExcel() {
    this.listaServicios.forEach(element => {
      let { id, nombre, cantidad } = element;
      let nuevo = {
        nombre: nombre,
        cantidad: cantidad,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFinal
      }
      this.listaExcel.push(nuevo);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listaExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Estadistica de uso por servicio.xls', { bookType: 'xls', type: 'buffer' });
  }

  cambiarPagina(e: PageEvent) {
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  anadirFechas() {
    document.getElementById('div-fecha').innerHTML = this.fechaInicio + '     -     ' + this.fechaFinal;
  }

  onItemSelect(item: any) {
    let { id, nombre } = item;
    this.servicioFiltrado.push(id);
  }
  
  onItemDeSelect(item: any) {
    let { id, nombre } = item;
    let n = this.servicioFiltrado.indexOf(id);
    this.servicioFiltrado.splice(n, 1);
  }
  
  onSelectAll(item: any) {
    item.forEach(e => {
      let {id, nombre} = e;
      if(this.servicioFiltrado.includes(id) == false){
        this.servicioFiltrado.push(id);
      }
    })
  }
  
  onDeSelectAll(item: any) {
    this.servicioFiltrado = [];
  }

  abrirModalFiltro(){
    this.switchModalFiltro = true;
  }

}