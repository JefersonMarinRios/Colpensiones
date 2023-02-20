import { Component, OnInit, ViewChild } from '@angular/core';
import * as _moment from 'moment';
// import { Map, marker, tileLayer } from 'leaflet';
import { MapaService } from '../servicios/mapa.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { element } from '@angular/core/src/render3/instructions';
import { MatPaginatorModule, PageEvent } from '@angular/material';
// import * as Map from 'leaflet';

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
  selector: 'appcolp-mapa-calor',
  templateUrl: './mapa-calor.component.html',
  styleUrls: ['./mapa-calor.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})


export class MapaCalorComponent implements OnInit {

  title = 'angular-leaflet';
  mapa: any;

  fechaInicial: string | null = null;
  fechaFinal: string | null = null;
  switchModalFiltro: boolean = false;
  alertaFechas: boolean = false;
  mensajeAlertaFechas: string | null = '';

  listaDatos: any[] | null = []; // lista de datos completa
  listaDatosFiltrada: any[] | null = []; // lista de datos filtrada por latitud y longitud
  mostratTable: boolean = false;
  datosTabla: any[] | null = [];

  // Paginacion
  datosTablaLength: number = 0;
  pageSize: number = 5; // cantidad de registros a mostrar
  desde: number = 0; // desde que registro mostrar
  hasta: number = 5; // hasta que registro mostrar
  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  // Cuerpo de los items de this.listaDatos
  // {
  //   "colpItem": {
  //       "id": 22,
  //       "colpLista": {
  //           "id": 2,
  //           "nombre": "ListaServicios",
  //           "estado": "ACTIVO"
  //       },
  //       "nombre": "Login",
  //       "estado": "ACTIVO",
  //       "idApp": null
  //   },
  //   "fecha": "2021-12-04T05:00:00.000+0000",
  //   "lat": 4.603011,
  //   "lng": -74.114666
  // },


  group: any = null;

  constructor(private service: MapaService, private router: Router, private route: ActivatedRoute) {
    this.fechaInicial = null;
    this.fechaFinal = null;

    this.route
      .queryParamMap
      .subscribe(e => {
        this.fechaInicial = e.get('d1');
        this.fechaFinal = e.get('d2');
      });
  }

  ngAfterViewInit() {
    this.initMap();
    this.listarTodo();
  }


  ngOnInit() {

  }

  listarTodo() {
    if (this.fechaInicial == null && this.fechaFinal == null) {
      const Hoy = new Date()
      this.fechaFinal = moment(Hoy).format('YYYY-MM-DD')
      let date = new Date(Hoy.getFullYear(), Hoy.getMonth(), 1)
      this.fechaInicial = moment(date).format('YYYY-MM-DD')

      let fechas = {
        "fechaInicial": this.fechaInicial,
        "fechaFinal": this.fechaFinal
      }

      this.service.filtrar(fechas).subscribe(res => {
        this.listaDatos = res;
        this.listaDatos.forEach(element => {
          let comparar = {
            'lng': element.lng,
            'lat': element.lat
          }
          if (this.listaDatosFiltrada.length == 0) {
            this.listaDatosFiltrada.push(comparar)
          } else if (this.listaDatosFiltrada.includes(comparar) == false) {
            this.listaDatosFiltrada.push(comparar)
          }
        })
        this.generarPuntos();
      }, err => console.error(err))
    } else {
      let fechas = {
        "fechaInicial": this.fechaInicial,
        "fechaFinal": this.fechaFinal
      }

      this.service.filtrar(fechas).subscribe(res => {
        this.listaDatos = res;
        this.listaDatos.forEach(element => {
          let comparar = {
            'lng': element.lng,
            'lat': element.lat
          }
          if (this.listaDatosFiltrada.length == 0) {
            this.listaDatosFiltrada.push(comparar)
          } else if (this.listaDatosFiltrada.includes(comparar) == false) {
            this.listaDatosFiltrada.push(comparar)
          }
        })
        this.switchModalFiltro = false;
        this.generarPuntos();
      }, err => console.error(err))
    }
  }

  filtrar() {
    // debugger;
    this.alertaFechas = false
    let fechaInicial = document.getElementById('filtroFechaInicial') as HTMLInputElement;
    let fechaFinal = document.getElementById('filtroFechaFinal') as HTMLInputElement;

    this.convertirFechas(fechaInicial.value, fechaFinal.value);
    // if (this.alertaFechas == false) {
    if (this.alertaFechas == false) {
      this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['mapa'], { queryParams: { d1: this.fechaInicial, d2: this.fechaFinal } }));
    }

  }

  generarPuntos() {
    this.group = L.featureGroup();

    this.listaDatosFiltrada.forEach(e => {
      const lon = e.lng;
      const lat = e.lat;
      const marker = L.circleMarker([lat, lon]) //{color: '#FF0000'}

      // marker.addTo(this.mapa);
      marker.addTo(this.group);

      marker.addEventListener('click', <LeafletMouseEvent>(e) => {
        this.datosTabla = null;
        this.datosTabla = [];
        let { lat, lng } = e.latlng;
        // console.log(e);
        // console.log(lat, ' ', lng);
        this.listaDatos.forEach(element => {
          if (element.lat == lat && element.lng == lng) {
            this.datosTabla.push(element);
          }
        })
        this.mostratTable = true;
        this.datosTablaLength = this.datosTabla.length;
      })
    })

    this.mapa.addLayer(this.group);
  }

  private initMap(): void {
    this.mapa = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.mapa);
  }

  // Cambiar la pagina
  cambiarPagina(e: PageEvent) {
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  abrirModalFiltro() {
    this.switchModalFiltro = true;
  }

  limpiarFiltros() {
    this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['mapa']));
  }

  convertirFechas(fechaInicial, fechaFinal) {
    let dateInicio, dateFinal;
    const Hoy = new Date();
    if (
      (fechaInicial == '' || fechaInicial == null || fechaInicial == undefined) &&
      (fechaFinal == '' || fechaFinal == null || fechaFinal == undefined)
    ) {  // listar el mes actual
        this.fechaFinal = moment(Hoy).format('YYYY-MM-DD')
        let date = new Date(Hoy.getFullYear(), Hoy.getMonth(), 1)
        this.fechaInicial = moment(date).format('YYYY-MM-DD')
    } else {
      if (
        (fechaInicial !== '' && fechaInicial !== null && fechaInicial !== undefined) &&
        (fechaFinal == '' || fechaFinal == null || fechaFinal == undefined)
      ) {
        fechaFinal = new Date();
        this.fechaInicial = moment(fechaInicial).format('YYYY-MM-DD')
        this.fechaFinal = moment(fechaFinal).format('YYYY-MM-DD')
      }

      if (
        (fechaInicial == '' || fechaInicial == null || fechaInicial == undefined) &&
        (fechaFinal !== '' && fechaFinal !== null && fechaFinal !== undefined)
      ) {
        this.fechaFinal = moment(fechaFinal).format('YYYY-MM-DD')
        let date = new Date(fechaFinal)
        let date2 = new Date(date.getFullYear(), date.getMonth(), 1)
        this.fechaInicial = moment(date2).format('YYYY-MM-DD')
      }

      if (
        (fechaInicial !== '' && fechaInicial !== null && fechaInicial !== undefined) &&
        (fechaFinal !== '' && fechaFinal !== null && fechaFinal !== undefined)
      ) {
        this.fechaInicial = moment(fechaInicial).format('YYYY-MM-DD')
        this.fechaFinal = moment(fechaFinal).format('YYYY-MM-DD')
      }

      dateInicio = new Date(this.fechaInicial)
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

}





