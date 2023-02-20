import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BoletinesBienestarService } from '../servicios/boletines-bienestar.service';
//import { BoletinesBienestarService } from '../servicios/boletines-bienestar.service';
import { BoletinesBienestar } from '../modelo/boletines-bienestar';
import { PageEvent } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'appcolp-boletines',
  templateUrl: './boletines.component.html',
  styleUrls: ['./boletines.component.css']
})
export class BoletinesComponent implements OnInit {
  

  enviarPUSH: boolean = false; // Interruptor para mostrar formulario PUSH
  boletin: BoletinesBienestar | null = null;
  boletines: BoletinesBienestar[] | null = null;
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
    private service: BoletinesBienestarService
  ) { }

  atras() {
    this.router.navigateByUrl('seccionBienestar', { skipLocationChange: true }).then(() => this.router.navigate(['seccionBienestar']));
  }
  
  ngOnInit() {
    this.presentacion = 'iconos'
    this.listarBoletines();
  }

  listarBoletines() {
    this.boletin = new BoletinesBienestar();
    this.service.listarBoletines().subscribe(res => {
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
    this.service.estadoBoletin(this.boletin).subscribe(res => {
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
      this.listarBoletines();
    }
  }

  confirmar() {
    debugger;
    let status;
    if (this.accion == 'eliminar') {
      this.service.eliminarBoletin(this.boletin).subscribe(res => {
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
      this.service.guardarBoletin(this.boletin).subscribe(res => {
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
      this.mensajeModal = 'Se ' + accionString + ' el boletin correctamente';
    } else {
      accionString = accion == 'duplicar' ? 'duplicar' : 'eliminar'
      this.mensajeModal = 'Hubo un fallo al ' + accionString + ' el boletin';
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
      this.mensajeModal = "¿Estás seguro que deseas duplicar el boletin?";
      this.textoBotonConfirmacion = "Duplicar"
    }
    if (accion == 'eliminar') {
      this.mensajeModal = "¿Estás seguro que deseas eliminar el boletin?";
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
