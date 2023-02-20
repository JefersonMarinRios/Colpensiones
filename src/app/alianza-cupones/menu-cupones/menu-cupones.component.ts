import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuponAlianzas } from 'src/app/modelo/cupon-alianzas';
import { AlianzasBienestarService } from 'src/app/servicios/alianzas-bienestar.service';

@Component({
  selector: 'appcolp-menu-cupones',
  templateUrl: './menu-cupones.component.html',
  styleUrls: ['./menu-cupones.component.css']
})

export class MenuCuponesComponent implements OnInit {
  @Input() cupones: CuponAlianzas[];
  @Input() idAlianza: number;

  modalAbierto: number | null = null;
  cupon: CuponAlianzas | null;

  mensajeModal: String = ""; // mensaje modal alerta
  switchModalAlerta: boolean = false; // interruptor modal alerta
  switchModalConfirmacion: boolean = false; // interruptor modal alerta
  accion: string | null = null; // valores 'duplicar' || 'eliminar'
  textoBotonConfirmacion: string | null = null; // valores 'duplicar' || 'eliminar'

  constructor(
    private service: AlianzasBienestarService,
    private router: Router,
  ) { 
  }

  ngOnInit() {
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

  cambiarEstadoCupon(event, id: number) {
    this.cupones.forEach(item => {
      if (item.id == id) {
        this.cupon = item;
        if (item.estado == 0) {
          item.estado = 1;
          this.cupon.estado = 1;
        } else {
          item.estado = 0;
          this.cupon.estado = 0;
        }
      }
    });
    this.service.cambiarEstadoCupon(this.cupon.id, this.cupon.estado).subscribe(res=>{
        let label = this.cupon.estado > 0 ? "Activo" : "Inactivo";
        document.getElementById("slideEstado-" + id).innerText = label;
    }, err => console.error(err))
  }

  cerrarModal(i) {
    if(i == 0){
      this.switchModalConfirmacion = false;
    }
    if(i == 1){
      this.switchModalAlerta = false;
        this.recargar();
    }
  }

  alerta( accion, status) {
    let accionString = '';
    this.cerrarModal(0)
    if (status == 200) {
      accionString = accion == 'duplicar' ? 'duplicó' : 'eliminó'
      this.mensajeModal = 'Se ' + accionString + ' el cupón correctamente';
    } else {
      accionString = accion == 'duplicar' ? 'duplicar' : 'eliminar'
      this.mensajeModal = 'Hubo un fallo al ' + accionString + ' el cupón';
    }
    this.switchModalAlerta = true;
  }

  confirmacion(accion: string, id: number){
    this.accion = accion;
    this.cupones.forEach(e =>{
      if(e.id == id) this.cupon = e;
    })

    if(accion == 'duplicar'){
      this.mensajeModal = "¿Estás seguro que deseas duplicar el cupón?";
      this.textoBotonConfirmacion = "Duplicar"
    }
    if(accion == 'eliminar'){
      this.mensajeModal = "¿Estás seguro que deseas eliminar el cupón?";
      this.textoBotonConfirmacion = "Eliminar"
    }
    this.switchModalConfirmacion = true;
  }
  
  confirmar(){
    debugger;
    let status;
    if (this.accion == 'eliminar') {
      this.service.eliminarCupon(this.cupon).subscribe(res => {
        status = 200;
        console.log(res);
        this.alerta(this.accion, status)
      }, err => {
        status = 400;
        console.error(err);
      })
    }if(this.accion == 'duplicar'){
      this.cupon.id = null;
      this.cupon.titulo = this.cupon.titulo + ' copia' 
      this.service.crearCupon(this.cupon).subscribe(res =>{
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

  recargar(){
  location.reload();      
  }
}
