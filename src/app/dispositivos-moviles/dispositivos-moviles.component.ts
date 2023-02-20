import { Component, HostListener, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SistemaOperativoService } from '../servicios/sistema-operativo.service'; // Servicio
import { EstadisticaSistemaOperativo } from '../modelo/estadistica-sistema-operativo'; // Modelo
import { Router } from '@angular/router';

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
  selector: 'appcolp-dispositivos-moviles',
  templateUrl: './dispositivos-moviles.component.html',
  styleUrls: ['./dispositivos-moviles.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})


export class DispositivosMovilesComponent implements OnInit{
  // grafica
  width = 800;
  height = 600;
  type = "doughnut2d";
  dataFormat = "json";

  data = {
    chart: {
      caption: "Grafica general",
      baseFont: "Open-Sans: regular",
      captionFontSize: "30",
      subcaptionFontSize: "20",
      subcaption: "Usuarios",
      showpercentvalues: "2",
      defaultcenterlabel: "76%",
      aligncaptionwithcanvas: "0",
      captionpadding: "0",
      decimals: "1",
      centerlabel: "# usuarios por $label: $value",
      plottooltext:
          "<b>$percentValue</b> porcentaje de usuarios que utilizan <b>$label</b>",
      theme: "fusion"
    },
    data: []
  };
  dataSource = this.data;

  // Lista de datos
  dato : EstadisticaSistemaOperativo = new EstadisticaSistemaOperativo(); // objeto de datos
  datos : EstadisticaSistemaOperativo[] = null; // lista de datos

  // Parametros de fechas
  fechaActualDate: Date = new Date(); // Fecha actual en formato Date
  fechaActual: string; // Fecha actual en formato yyyy-mm-dd
  inicioMes: string; // Dato inicio de mes en formato yyyy-mm-dd
  fechaInicio: string; // Fecha inicio en formato yyyy-mm-dd --> Filtro del front
  fechaFinal: string; // Fecha final en formato yyyy-mm-dd --> Filtro del front

  // contador 
  contador: number = 0;

  // arreglo para colores
  arregloColores:any = []

  switchModalFiltro: boolean = false;

  alertaFechas: boolean = false;
  mensajeAlertaFechas: string | null = '';

  constructor(
    private servicio: SistemaOperativoService,
    private router: Router // enrutador 
  ){
    let diaActual = this.fechaActualDate.getDate() <= 9 ? '0' + this.fechaActualDate.getDate() : this.fechaActualDate.getDate()
    let mesActual = this.fechaActualDate.getMonth() < 9 ? '0' + (this.fechaActualDate.getMonth() + 1).toString() : this.fechaActualDate.getMonth() + 1; // Definir el inicio del mes actual
    this.fechaActual = this.fechaActualDate.getFullYear().toString() + '-' + mesActual.toString() + '-' + diaActual.toString(); // Define la fecha actual en formato yyyy-mm-dd
    this.inicioMes = this.fechaActualDate.getFullYear().toString() + '-' + mesActual.toString() + '-01'; // Define el inicio del mes actual en en formato yyyy-mm-dd
    this.fechaInicio = this.inicioMes;
    this.fechaFinal = this.fechaActual;
    this.arregloColores = []
    this.switchModalFiltro = false;
  }
  
  ngOnInit() {
    this.data.data = [];
    this.listarXFechas();
    // this.resetTimer();
  }

  listarXFechas(){
    this.data.data = [];
    this.arregloColores = [];
    let fechas = {}
    fechas = {
      "fechaInicial": this.fechaInicio,
      "fechaFinal": this.fechaFinal
    }
    this.anadirFechas();

    this.servicio.listarTodo(fechas).subscribe(res=>{
      this.datos = res;
      let contador = 0;
      this.datos.forEach(element =>{
        // segunda graficas
        let {nombre, cantidad} = element;
        let push = {
          "label": nombre,
          "value": cantidad
        }
        contador = contador + cantidad;
        this.data.data.push(push)
      });

      this.datos.forEach(element =>{
        let color = '';
        let porcentaje = 0;
        if(element.nombre == 'Otro') color = '#656565'
        if(element.nombre == 'iOS') color = '#03a9f4'
        if(element.nombre == 'Android') color = '#00993e'

        if(element.cantidad == 0 ) porcentaje = 0;
        if(element.cantidad > 0 ) porcentaje = (element.cantidad*100)/contador;
        let formato = {
          id: element.id,
          color: color,
          porcentaje: Math.trunc(porcentaje)
        }
        this.arregloColores.push(formato);
      })
      this.contador = contador;
      this.data.chart.defaultcenterlabel = contador + ' usuarios'
      this.data.chart.subcaption = 'Total de usuarios: ' + contador
    }, err => console.error(err))
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

  llenarGrafica(id){
    let elemento;
    this.arregloColores.forEach(element =>{
      if(element.id == id) elemento = element;
    });
    let porcentajeBlanco = 100 - elemento.porcentaje;
    let grafica = document.getElementById('div-'+id);
    grafica.style.background = 'linear-gradient(#cfd8dc '+porcentajeBlanco+'%, '+elemento.color+' '+elemento.porcentaje+'%)';
    document.getElementById('h3-'+id).innerHTML = elemento.porcentaje + '%';
    document.getElementById('h3-'+id).style.color = elemento.color;
    document.getElementById('circulo-'+id).style.background = elemento.color;
  }

  limpiarFiltros(){
    this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['dispositivos']));
  }

  filtrar(){
    let fechaInicial = (document.getElementById('filtroFechaInicio') as HTMLInputElement).value, 
    fechaFinal = (document.getElementById('filtroFechaFinal') as HTMLInputElement).value;
    this.convertirFechas(fechaInicial, fechaFinal);
    if(this.alertaFechas == false){
      this.listarXFechas();
      this.switchModalFiltro = false;
    }
  }

  anadirFechas(){
    let fechas = this.fechaInicio + ' - ' + this.fechaFinal;
    (document.getElementById('div-fecha1') as HTMLDivElement) .innerHTML = fechas;
  }

  abrirModalFiltro(){
    this.switchModalFiltro = true;
  }
}