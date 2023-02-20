import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PodcastEducacionService } from '../servicios/podcast-educacion.service';
import { PodcastEducacion } from '../modelo/podcast-educacion';
import { PageEvent } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'appcolp-podcast-educacion',
  templateUrl: './podcast-educacion.component.html',
  styleUrls: ['./podcast-educacion.component.css']
})
export class PodcastEducacionComponent implements OnInit {
  enviarPUSH: boolean = false; // Interruptor para mostrar formulario PUSH
  podcast: PodcastEducacion | null = null;
  podcasts: PodcastEducacion[] | null = null;
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
    private service: PodcastEducacionService
  ) { }

  ngOnInit() {
    this.presentacion = 'iconos'
    this.listarPodcasts();
  }

  listarPodcasts() {
    //this.podcast = new PodcastEducacion();
    this.service.listarPodcasts().subscribe(res => {
      this.podcasts = res;
      this.tamanoTabla = this.podcasts.length;
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
    this.podcasts.forEach(item => {
      if (item.id == id) {
        this.podcast = item;
        if (item.estado == 0) {
          item.estado = 1;
          this.podcast.estado = 1;
        } else {
          item.estado = 0;
          this.podcast.estado = 0;
        }
      }
    });
    //this.service.estadoPodcast(this.podcast).subscribe(res => {
    this.service.actualizarPodcast(this.podcast).subscribe(res => {
      let label = this.podcast.estado > 0 ? "Activo" : "Inactivo";
      document.getElementById("slideEstado-" + id).innerText = label;
    }, err => console.error(err))
  }

  cerrarModal(i) {
    if (i == 0) {
      this.modalSwitchConfirmacion = false;
    }
    if (i == 1) {
      this.switchModalAlerta = false;
      this.listarPodcasts();
    }
  }

  confirmar() {
    debugger;
    let status;
    if (this.accion == 'eliminar') {
      this.service.eliminarPodcast(this.podcast).subscribe(res => {
        status = 200;
        console.log(res);
        this.alerta(this.accion, status)
      }, err => {
        status = 400;
        console.error(err);
      })
    } if (this.accion == 'duplicar') {
      this.podcast.id = null;
      this.podcast.titulo = this.podcast.titulo + ' copia'
      this.service.guardarPodcast(this.podcast).subscribe(res => {
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
      this.mensajeModal = 'Se ' + accionString + ' el pódcast correctamente';
    } else {
      accionString = accion == 'duplicar' ? 'duplicar' : 'eliminar'
      this.mensajeModal = 'Hubo un fallo al ' + accionString + ' el pódcast';
    }
    this.switchModalAlerta = true;
  }

  confirmacion(accion: string, id: number) {
    // debugger;
    this.accion = accion;
    this.modalSwitchConfirmacion = true;
    this.podcasts.forEach(e => {
      if (e.id == id) {
        this.podcast = e;
      }
    })

    if (accion == 'duplicar') {
      this.mensajeModal = "¿Estás seguro que deseas duplicar el pódcast?";
      this.textoBotonConfirmacion = "Duplicar"
    }
    if (accion == 'eliminar') {
      this.mensajeModal = "¿Estás seguro que deseas eliminar el pódcast?";
      this.textoBotonConfirmacion = "Eliminar"
    }
  }


  cambiarPresentacion(presentacion: string) {
    this.presentacion = presentacion;
  }

  // Cambiar la pagina
  cambiarPagina(e: PageEvent) {
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  atras() {
    this.router.navigateByUrl('seccionEducacion', { skipLocationChange: true }).then(() => this.router.navigate(['seccionEducacion']));
  }
}
