import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDatepickerInput, MatDatepickerInputEvent, MatSnackBar, MatTableDataSource, Sort } from '@angular/material';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { Usuario } from '../../modelo/usuario';
import { UsuarioService } from '../../servicios/usuario.service';
import { EstadisticasusoService } from '../../servicios/estadisticasuso.service';
import { EstadisticaUsoDTO } from '../../modelo/estadistica-uso-dto';
import { EstadisticasUso } from '../../modelo/estadisticas-uso';
import { DatosEstadisticaUsoDTO } from '../../modelo/datos-estadistica-uso-dto';
import { Router } from '@angular/router';
import { EstadisticausoDTO } from 'src/app/modelo/estadisticaUsoDTO';
import { Item } from 'src/app/modelo/item';
import { ItemService } from 'src/app/servicios/item-service.service';
import { DatosEstadisticaService } from 'src/app/servicios/datos-servicios/datos-estadistica.service';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'appcolp-header',
  templateUrl: './header.component.html',
  styleUrls: ['../../layouts/admin-layout/admin-layout.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe],
})
export class HeaderComponent implements OnInit {
  startDate = new Date();
  startDate2 = new Date();
  minDate = new Date();
  date = new FormControl();
  date2 = new FormControl();

  displayedColumns = ['Servicio', 'Cantidad'];
  dataSource = new MatTableDataSource();

  estadisticaUso: EstadisticasUso;
  item: Item[];
  estadisticaUsoDTO: EstadisticaUsoDTO;
  itemSet: Item;
  listaDatos: String[];
  listaLabels: String[];
  selectedServicio: Item;
  barChartType: String;
  respuesta: EstadisticasUso[];
  listaExport: EstadisticausoDTO[];
  datoExport: EstadisticausoDTO;
  itemExport:Item;
  itemExport2:EstadisticasUso;
  @Input() datosEstadisticaUsoDTO: DatosEstadisticaUsoDTO;
  estadisticadeUsoService: any;
  datePipe: any;

  tiempo: any; // cerrar sesion 
  
  time: string;
  time2: string;
  i: number;
  datosColumn: any;
  dataSourceFuse: { chart: { numberSuffix: string; theme: string; caption: string; }; data: any; };

  usuarioLog: any = null;

  switchModal: boolean = false;
  
  constructor(private router: Router, private itemService: ItemService, private datosEstadisticaService: DatosEstadisticaService,
    private zone: NgZone,) {
    this.estadisticaUsoDTO = new EstadisticaUsoDTO();
    this.itemSet = new Item();
    this.listaExport = new Array();
    this.itemExport = new Item();
    this.itemExport2 = new EstadisticasUso(); 
    this.usuarioLog = JSON.parse(localStorage.getItem('usuarioColp'));
    // console.log(this.usuarioLog);
  }

  ngOnInit() {
    this.startDate.setDate(this.startDate.getDate() - 30);
    this.estadisticaUsoDTO.fechaInicial = this.startDate;
    this.estadisticaUsoDTO.fechaFinal = this.startDate2;
    this.estadisticaUsoDTO.item = null;

    // this.estadisticadeUsoService.estadisticaUsoXFechasTable(this.estadisticaUsoDTO).subscribe(res => {
    //   this.respuesta = res;
    //   this.dataSource = new MatTableDataSource(this.respuesta);
    // }, error => { console.log(error); });

    // this.time = this.datePipe.transform(this.estadisticaUsoDTO.fechaInicial, 'yyyy-dd-MM');
    // this.time2 = this.datePipe.transform(this.estadisticaUsoDTO.fechaFinal, 'yyyy-dd-MM');
    this.itemService.listarTodo().subscribe(res => {
      this.item = res;
      this.itemSet.nombre = 'Todos los servicios';
      this.item.push(this.itemSet);
    }, error => { console.log(error); });
  }

  public datos(servicio: Item) {
    // this.numeros = this.datosEstadisticaService.setListaDatos(this.startDate, this.startDate2, this.estadisticaUsoDTO.item).cantidad;
    if (this.date.value !== null) {
      this.estadisticaUsoDTO.fechaInicial = this.date.value;

    } else { this.estadisticaUsoDTO.fechaInicial = this.startDate; }

    if (this.date2.value !== null) {
      this.estadisticaUsoDTO.fechaFinal = this.date2.value;

    } else { this.estadisticaUsoDTO.fechaFinal = this.startDate2; }
    this.estadisticaUsoDTO.item = servicio;

    // this.estadisticadeUsoService.estadisticaUsoXFechasTable(this.estadisticaUsoDTO).subscribe(res => {
    //   this.respuesta = res;
    //   this.dataSource = new MatTableDataSource(this.respuesta);
    // }, error => { console.log(error); });

    this.time = this.datePipe.transform(this.estadisticaUsoDTO.fechaInicial, 'yyyy-dd-MM');
    this.time2 = this.datePipe.transform(this.estadisticaUsoDTO.fechaFinal, 'yyyy-dd-MM');

    this.estadisticadeUsoService.datosXFecha(this.estadisticaUsoDTO).subscribe(
      res => {
        this.datosColumn = res;
        const data = {
          "chart": {
            "numberSuffix": "34",
            "theme": "fusion",
            "caption": this.time + " - " + this.time2,
          },
          "data": this.datosColumn,
        };
        this.dataSourceFuse = data;
      },
      error => { console.log(error) }
    );
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.startDate = new Date(event.value);
  }

  addEvent2(type: string, event: MatDatepickerInputEvent<Date>) {
    this.startDate2 = new Date(event.value);
  }

  cerrar() {
    localStorage.removeItem('usuarioColp');
    this.router.navigate(['login']);
  }

  cerrarModal(){
    this.switchModal = false;
  }
  
  abrirModal(){
    this.switchModal = true;
  }
}
