import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EncuestaService } from '../servicios/encuestas.service';
import { Estrellas } from '../modelo/estrellas';
import { MatPaginatorModule, PageEvent } from '@angular/material';


@Component({
  selector: 'appcolp-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements OnInit {

  estrella: Estrellas | null = null;
  estrellas: Estrellas[] | null = null;

   // Paginacion
   estrellasLength: number = 0;
   pageSize: number = 5; // cantidad de registros a mostrar
   desde: number = 0; // desde que registro mostrar
   hasta: number = 5; // hasta que registro mostrar
   @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
   // Fin paginacion
  
  constructor(
    private router: Router,
    private service: EncuestaService
  ) { }

  ngOnInit() {
    this.listarEstrellas();
  }

  listarEstrellas(){
    this.service.getEstrellas().subscribe( res => {
      this.estrellas = res;
      this.estrellasLength = this.estrellas.length;
    }, err =>{
      console.error(err);
    })
  }

  // Cambiar la pagina
  cambiarPagina(e: PageEvent) {
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  cambioEstado($event, id) {
    let input = $event.target as HTMLInputElement;
    this.estrella = this.estrellas.find(element => {
      return element.id == id
    })
    this.estrella.estado = input.checked == true ? 1 : 0;
    this.service.putEstrellas(this.estrella).subscribe(res => {
      console.log(res)
    }, err => {
      console.error(err);
    });
  }

}
