import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NoticiasEducacionService} from '../servicios/noticias-educacion.service'
import { NoticiasEducacion } from '../modelo/noticias-educacion';
import { PageEvent } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'appcolp-noticias-educacion',
  templateUrl: './noticias-educacion.component.html',
  styleUrls: ['./noticias-educacion.component.css']
})
export class NoticiasEducacionComponent implements OnInit {
  
    enviarPUSH: boolean = false; // Interruptor para mostrar formulario PUSH
    boletin: NoticiasEducacion | null = null;
    boletines: NoticiasEducacion[] | null = null;
    modalAbierto: number = null; // modal abierto opciones categoria 
    // Modal
    modalSwitch: boolean = false; // interruptor para mostrar modal
    modalSwitchConfirmacion: boolean = false; // interruptor para mostrar modal confirmación
    mensajeModal: String = ""; // mensaje modal alerta
    switchModalAlerta: boolean = false; // interruptor modal alerta
  
    accion: string | null = null; // identificar la accion realizada 
    textoBotonConfirmacion: string | null = null;
  
    presentacion: string | null = null; // cambiar la presentacion de los registros, valores 'tabla' 'iconos'
  
  
    // Paginacion
    tamanoTabla: number = 0;
    pageSize: number = 5; // cantidad de registros a mostrar
    desde: number = 0; // desde que registro mostrar
    hasta: number = 5; // hasta que registro mostrar
    @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  
    constructor(
      private router: Router,
      private service: NoticiasEducacionService
    ) { }

    atras() {
      this.router.navigateByUrl('seccionEducacion', { skipLocationChange: true }).then(() => this.router.navigate(['seccionEducacion']));
    }

    ngOnInit() {
      this.presentacion = 'iconos'
      this.listarNoticias();
    }
  
    listarNoticias() {
      this.boletin = new NoticiasEducacion();
      this.service.listarNoticias().subscribe(res => {
        this.boletines = res;
        this.tamanoTabla = this.boletines.length; 
      }, err => {
        console.log(err);
      })
    }
  
    abrirModal(i) { // abrir modal de opciones de alianzas
      if (this.modalAbierto != i && this.modalAbierto != null) {
        document.getElementById("modal" + this.modalAbierto).style.display = "none";
        this.modalAbierto = null;
      }
      if (this.modalAbierto == null) {
        document.getElementById("modal" + i).style.display = "block";
        this.modalAbierto = i;
      } else {
        this.modalAbierto = null;
        document.getElementById("modal" + i).style.display = "none";
      }
    }
  
    cambiarEstado(event, id: number) {
      this.boletines.forEach(item => {
        if (item.id == id) {
          this.boletin = item;
          if (item.estado == 0) {
            item.estado = 1;
            this.boletin.estado = 1;
          } else {
            item.estado = 0;
            this.boletin.estado = 0;
          }
        }
      });
      // this.service.estadoNoticia(this.boletin).subscribe(res => {
      this.service.actualizarNoticia(this.boletin).subscribe(res => {
      let label = this.boletin.estado > 0 ? "Activo" : "Inactivo";
        document.getElementById("slideEstado-" + id).innerText = label;
      }, err => console.error(err))
    }
  
    cerrarModal(i) {
      if (i == 0) {
        this.modalSwitchConfirmacion = false;
      }
      if (i == 1) {
        this.switchModalAlerta = false;
        this.listarNoticias();
      }
    }
  
    confirmar() {
      debugger;
      let status;
      if (this.accion == 'eliminar') {
        this.service.eliminarNoticia(this.boletin).subscribe(res => {
          status = 200;
          console.log(res);
          this.alerta(this.accion, status)
        }, err => {
          status = 400;
          console.error(err);
        })
      } if (this.accion == 'duplicar') {
        this.boletin.id = null;
        this.boletin.titulo = this.boletin.titulo + ' copia'
        this.service.guardarNoticia(this.boletin).subscribe(res => {
          status = 200;
          console.log(res);
          this.alerta(this.accion, status)
        }, err => {
          status = 400;
          console.log(err)
          this.alerta(this.accion, status)
        })
      }
    }
  
    alerta(accion, status) {
      let accionString = '';
      this.cerrarModal(0)
      if (status == 200) {
        accionString = accion == 'duplicar' ? 'duplicó' : 'eliminó'
        this.mensajeModal = 'Se ' + accionString + ' la noticia correctamente';
      } else {
        accionString = accion == 'duplicar' ? 'duplicar' : 'eliminar'
        this.mensajeModal = 'Hubo un fallo al ' + accionString + ' la noticia';
      }
      this.switchModalAlerta = true;
    }
  
    confirmacion(accion: string, id: number) {
      // debugger;
      this.accion = accion;
      this.modalSwitchConfirmacion = true;
      this.boletines.forEach(e => {
        if (e.id == id) {
          this.boletin = e;
        }
      })
  
      if (accion == 'duplicar') {
        this.mensajeModal = "¿Estás seguro que deseas duplicar la noticia?";
        this.textoBotonConfirmacion = "Duplicar"
      }
      if (accion == 'eliminar') {
        this.mensajeModal = "¿Estás seguro que deseas eliminar la noticia?";
        this.textoBotonConfirmacion = "Eliminar"
      }
    }
  
  
    cambiarPresentacion(presentacion: string){
      this.presentacion = presentacion;
    }
  
     // Cambiar la pagina
     cambiarPagina(e: PageEvent) {
      this.desde = e.pageIndex * e.pageSize;
      this.hasta = this.desde + e.pageSize;
    }
  
  }
