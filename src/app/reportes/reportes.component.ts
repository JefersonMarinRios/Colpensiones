import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material';
// importar servicios y modelos
import { Reporte, SistemaOperativo, TipoDocumento, NombreServicio, Accion } from '../modelo/reporte';
import { ReporteService } from '../servicios/reportes.service';
import { IdNombre } from '../modelo/idNombre';
import * as moment from 'moment';

import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    // dateInput: 'DD/MM/YYYY',
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    // dateInput: 'DD/MM/YYYY',
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'appcolp-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ReportesComponent implements OnInit {
  /*****************************************************************/
  reporte: Reporte | null = null;
  reportes: Reporte[] | null = null;
  reportesLength: number = 0;
  stringJSON = [];

  /****************************************************************/

  switchModalFiltro: boolean = false;
  switchModal: boolean = false;
  accionFormulario: string = "";

  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;

  // paginacion 
  pageSize: number = 5; // numero de registros por pagina
  desde: number = 0; // desde que registro mostrar
  hasta: number = 5; // hasta que registro mostrar
  // fin paginacion

  // Parametros de fechas
  fechaActualDate: Date = new Date(); // Fecha actual en formato Date
  fechaActual: String; // Fecha actual en formato yyyy-mm-dd
  inicioMes: String; // Dato inicio de mes en formato yyyy-mm-dd
  fechaInicio: String; // Fecha inicio en formato yyyy-mm-dd --> Filtro del front
  fechaFinal: String; // Fecha final en formato yyyy-mm-dd --> Filtro del front
  // Fin fechas

  // Listas de datos
  dato: any = null;
  datos: any = []
  // Fin listas de datos 

  // Parametros de filtrado
  tipoDocumentoFil: TipoDocumento[] = [];
  sistemaOperativoFil: SistemaOperativo[] = [];
  nombreServicioFil: NombreServicio[] = [];
  accionFil: Accion[] = [];
  reportePaisFil: IdNombre[] = [];
  reporteCiudadFil: IdNombre[] = [];
  // END Parametros de filtrado

  constructor(
    private service: ReporteService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    // let diaActual = this.fechaActualDate.getDate() <= 9 ? '0' + this.fechaActualDate.getDate() : this.fechaActualDate.getDate()
    // let mesActual = this.fechaActualDate.getMonth() < 9 ? '0' + (this.fechaActualDate.getMonth() + 1).toString() : this.fechaActualDate.getMonth() + 1; // Definir el inicio del mes actual
    // this.fechaActual = this.fechaActualDate.getFullYear().toString() + '-' + mesActual.toString() + '-' + diaActual.toString(); // Define la fecha actual en formato yyyy-mm-dd
    // this.inicioMes = this.fechaActualDate.getFullYear().toString() + '-' + mesActual.toString() + '-01'; // Define el inicio del mes actual en en formato yyyy-mm-dd
    // this.fechaInicio = this.inicioMes;
    // this.fechaFinal = this.fechaActual;
    this.fechaActual = moment(this.fechaActualDate).format('YYYY-MM-DD')
    let inicioMes = new Date(this.fechaActualDate.getFullYear(), this.fechaActualDate.getMonth(), 1)
    this.inicioMes = moment(inicioMes).format('YYYY-MM-DD')
    this.fechaInicio = this.inicioMes;
    this.fechaFinal = this.fechaActual;
  }

  ngOnInit() {
    // this.resetTimer();
    this.listarXFechas();
    this.listarTodo();
    this.pedirParametros()
  }

  pedirParametros() {
    this.service.pedirParametros().subscribe(res => {
      this.tipoDocumentoFil = res.documentos;
      this.sistemaOperativoFil = res.sistemasOperativos;
      this.nombreServicioFil = res.servicios;
      this.accionFil = res.acciones;
      this.reportePaisFil = res.paises;
      this.reporteCiudadFil = res.ciudades;

    }, err => { console.error(err) })
  }
  /***********************************************************/
  listarTodo() {
    this.service.listarTodo().subscribe(res => {
      this.reportes = res;
      this.reportesLength = this.reportes.length;
      console.log(res)
    }, err => {
      console.error(err)
    })
  }
  /***********************************************************/
  listarXFechas() {
    this.datos = [];
    this.dato = null;
    let fechas = {}
    fechas = {
      "fechaInicial": this.fechaInicio,
      "fechaFinal": this.fechaFinal
    }
    this.service.listarXFechas(fechas).subscribe(res => {
      this.datos = res;
    }, err => console.error(err))
    this.switchModalFiltro = false;
  }

  /***********************************************************/
  convertirFechas(fecha1: string, fecha2: string) { // primer parametro = fecha inicial // segundo parametro = fecha final
    // sacar fecha en un objeto tipo Date()
    let fechaUno = new Date(fecha1);
    let fechaDos = new Date(fecha2);
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

  filtrar() {
    //debugger
    let tipoDocumento = (document.getElementById('filtroTipoDocumento') as HTMLSelectElement).value;
    let numeroDocumento = (document.getElementById('filtroNumeroDocumento') as HTMLSelectElement).value;
    let autenticado = (document.getElementById('filtroAutenticado') as HTMLSelectElement).value;
    let sistemaOperativo = (document.getElementById('filtroSistemaOperativo') as HTMLSelectElement).value;
    // let nombreServicio = (document.getElementById('filtroServicioUtilizado') as HTMLSelectElement).value;
    let accion = (document.getElementById('filtroAccionRealizada') as HTMLSelectElement).value;
    // let pais = (document.getElementById('filtroPais') as HTMLSelectElement).value;
    // let ciudad = (document.getElementById('filtroCiudad') as HTMLSelectElement).value;

    let envio;
    let stringJSON = ''
    let contador = 0
    stringJSON += '{'
    if (tipoDocumento != '0' && tipoDocumento != undefined && tipoDocumento != null) {
      stringJSON += `
      "tipoDocumento": {
        "id": ${parseInt(tipoDocumento)}
      }`
      contador++
    }
    if (numeroDocumento != '' && autenticado != undefined && autenticado != null) {
      if (contador > 0) stringJSON += ','
      stringJSON += `
      "documento": "${numeroDocumento}"
      `
      contador++
    }

    if (autenticado != 'null' && autenticado != undefined && autenticado != null) {
      if (contador > 0) stringJSON += ','
      stringJSON += `
      "autenticado": ${parseInt(autenticado)}
      `
      contador++
    }

    if (sistemaOperativo != '0' && sistemaOperativo != undefined && sistemaOperativo != null) {
      if (contador > 0) stringJSON += ','
      stringJSON += `
      "sistemaOperativo": {
        "id": ${parseInt(sistemaOperativo)}
      }`
      contador++
    }
    // if (nombreServicio != '0' && nombreServicio != undefined && nombreServicio != null) {
    //   if (contador > 0) stringJSON += ','
    //   stringJSON += `
    //   "nombreServicio": {
    //     "id": ${parseInt(nombreServicio)}
    //   }`
    //   contador++
    // }
    if (accion != '0' && accion != undefined && accion != null) {
      if (contador > 0) stringJSON += ','
      stringJSON += `
      "accion": {
        "id": ${parseInt(accion)}
      }`
      contador++
    }
    // if (pais != '0' && pais != undefined && pais != null) {
    //   if (contador > 0) stringJSON += ','
    //   stringJSON += `
    //   "pais": {
    //     "id": ${parseInt(pais)}
    //   }`
    //   contador++
    // }
    // if (ciudad != '0' && ciudad != undefined && ciudad != null) {
    //   if (contador > 0) stringJSON += ','
    //   stringJSON += `
    //   "ciudad": {
    //     "id": ${parseInt(ciudad)}
    //   }`
    //   contador++
    // }

    /*****************************************************************************************************/
    let filtroFechaInicio = (document.getElementById('filtroFechaInicio') as HTMLInputElement).value;
    let filtroFechaFinal = (document.getElementById('filtroFechaFinal') as HTMLInputElement).value;

    if (filtroFechaInicio != '' && filtroFechaInicio != undefined && filtroFechaInicio != null) {
      filtroFechaInicio = moment(filtroFechaInicio).format('YYYY-MM-DD')
    } else {
      filtroFechaInicio = null;
    }

    if (filtroFechaFinal != '' && filtroFechaFinal != undefined && filtroFechaFinal != null) {
      filtroFechaFinal = moment(filtroFechaFinal).format('YYYY-MM-DD')
    } else {
      filtroFechaFinal = null;
    }
    if (contador > 0) stringJSON += ','
    stringJSON += `
      "fechaInicial": "${filtroFechaInicio}",
      "fechaFinal": "${filtroFechaFinal}",
      "descargar": false
    `
    stringJSON += '}'
    console.log(stringJSON);

    envio = JSON.parse(stringJSON);
    console.log(envio);
    // if(contador > 0){
      this.service.filtrar(envio).subscribe(res => {
        this.reportes = res;
        this.reportesLength = this.reportes.length;
      }, err => console.error(err))
    // }else{
    //   stringJSON = `
    //   {
    //     "fechaInicial": "${filtroFechaInicio}",
    //     "fechaFinal": "${filtroFechaFinal}"
    //   }
    //   `
    //   envio = JSON.parse(stringJSON);
    //   this.service.listarXFechas(envio).subscribe(res => {
    //     this.reportes = res;
    //     this.reportesLength = this.reportes.length;
    //   }, err => console.error(err))
    // }


    this.switchModalFiltro = false;
  }
  
  /************** Limpiar filtros ************************/
  limpiarFiltros() {
    document.querySelector('').setAttribute('placeholder','');
  }
  /************** Cambiar página ************************/
  cambiarPagina(e: PageEvent) {
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  retornarFecha(input: string) {
    let arrayFecha = input.split('T');
    let fecha = arrayFecha[0];
    let arrayHora = arrayFecha[1].split('.');
    let hora = arrayHora[0];
    return fecha + ' ' + hora;
  }


  abrirModalFiltro() {
    this.switchModalFiltro = true;
  }

  atras() {
    this.router.navigateByUrl('reportes', { skipLocationChange: true }).then(() => this.router.navigate(['home']));
  }

  exportExcel() {
    let ejemplo = []
    this.reportes.forEach(e => {
      let obj = {
        id: e.id,
        tipoDocumento: e.tipoDocumento.valor,
        documento: e.documento,
        sistemaOperativo: e.sistemaOperativo.nombre,
        nombreServicio: e.nombreServicio.nombre,
        login: e.autenticado == 1 ? 'Autenticado' : 'No autenticado',
        accion: e.accion.nombre,
        correo: e.correo,
        fechaReporte: e.fechaReporte,
        latitud: e.latitud,
        longitud: e.longitud,
        ciudad: e.ciudad.nombre,
        pais: e.pais.nombre
      }
      ejemplo.push(obj)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ejemplo);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'reporte.xls', { bookType: 'xls', type: 'buffer' });
  }

  validarNumero($event){
    let input = $event.target as HTMLInputElement;
    if(input.value.length < 25){
      var code = ($event.which) ? $event.which : $event.keyCode;
      if (code >= 48 && code <= 57) return true;
      else return false
    }else return false
  }

  ajustarTamano(valor){
    let table = document.getElementById('table-registros') as HTMLElement;
    if(valor == 1) table.style.width = '140%';
    if(valor == 2) table.style.width = '100%';
  }

}

