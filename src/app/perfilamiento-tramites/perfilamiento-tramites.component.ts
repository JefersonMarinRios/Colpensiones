import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material';

// importar servicios y modelos

import { Perfilamiento } from '../modelo/perfilamiento';
import { PerfilPerfilamiento as Perfil } from '../modelo/perfil-perfilamiento';
import { PerfilamientoService } from '../servicios/perfilamiento.service';
import { Usuario } from '../modelo/usuario';


@Component({
  selector: 'appcolp-perfilamiento-tramites',
  templateUrl: './perfilamiento-tramites.component.html',
  styleUrls: ['./perfilamiento-tramites.component.css']
})
export class PerfilamientoTramitesComponent implements OnInit {

  // Objetos de datos
  registro: Perfilamiento | null = null;
  registros: Perfilamiento[] | null = null;

  perfil: Perfil | null = null;
  perfiles: Perfil[] | null = null;
  // Fin objetos de datos

  // Paginacion
  lengthTable: number = 0;
  pageSize: number = 5; // cantidad de registros a mostrar
  desde: number = 0; // desde que registro mostrar
  hasta: number = 5; // hasta que registro mostrar
  // Fin paginacion

  // Modal
  switchModal: boolean = false;
  switchModalAlerta: boolean = false;
  mensajeModal: String = "";
  modalTitle: String = ""; // Titulo del modal
  accionFormulario: string = ""; // Accion del formulario
  // Fin Modal

  // Otros
  activeButton: boolean = false;
  campos: boolean = false // Validacion de campos
  estadoSeleccionado: any;
  // Fin otros

  usuarioLog: Usuario | null = null;
  activePaginator: boolean = true;
  presentacion: string | null = null

  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;

  constructor(
    private router: Router,
    public snackbar: MatSnackBar,
    // añadir servicios una vez creados
    private service: PerfilamientoService
  ) {
    this.usuarioLog = JSON.parse(localStorage.getItem('usuarioColp'));
    if(this.usuarioLog.colpRol.id != 1) this.router.navigate(['home']);
    this.perfil = new Perfil();
    this.registro = new Perfilamiento();
  }

  ngOnInit() {
    this.listarTodo();
  }

  formulario(id) { // abrir modal para editar
    this.registros.forEach(element => {
      if (element.id_item == id) this.registro = element;
    })
    this.switchModal = true;
    this.estadoSeleccionado = this.registro.estado;
    this.modalTitle = "Editar"
  }

  envioFormulario(accion: string) {
    this.campos = false;
    if (accion == "editar") {
      let inputNombre = (document.getElementById('inputNombre') as HTMLInputElement).value;
      let inputEstado = (document.getElementById('inputEstado') as HTMLInputElement).value;
      if (
        (inputNombre == '' || inputNombre == null || inputNombre == undefined)
      ){
        this.campos = true;
        document.getElementById('inputNombre').classList.add('campo-vacio');
        document.getElementById('spanNombre').style.display = 'block';
      }
      if(
        (inputEstado == '' || inputEstado == null || inputEstado == undefined)
      ){
        this.campos = true;
        document.getElementById('inputEstado').classList.add('campo-vacio');
      }
      if(this.campos == false){
        this.registro.nombre_tramite = inputNombre;
        this.registro.estado = parseInt(inputEstado);
        this.cerrarModal(0);
      }
    }
    if (accion == "perfilamiento") {
      let checks = document.getElementsByClassName('testeo-perfiles');
      for (let i = 0; i < checks.length; i++) {
        let check = (checks[i] as HTMLInputElement);
        this.registro.perfiles.forEach(element => {
          if (check.value == element.id_perfil) {
            if (check.checked == true) {
              element.estado = 1;
            } else {
              element.estado = 0;
            }
          }
        })
      }
    }
    if(this.campos == false){
      this.service.modificar(this.registro).subscribe(res => {
        let mensaje = "";
        if (res.status == 200 || res.status == '200') {
          // mensaje = "El perfilamiento se ha guardado correctamente";
          mensaje = "El perfilamiento se ha guardado correctamente";
        } else {
          mensaje = "Ocurrio un fallo al guardar el perfilamiento ";
        }
        this.modalAlerta(mensaje, accion);
      }, err => {
        console.error(err)
        let mensaje = "";
        if (err.status == 200 || err.status == '200') {
          mensaje = "El perfilamiento se ha guardado correctamente";
        } else {
          mensaje = "Ocurrio un fallo al guardar el perfilamiento ";
        }
        this.modalAlerta(mensaje, accion);
      })
    }
  }

  listarTodo() {
    this.service.listarPerfilamiento().subscribe(res => {
      this.registros = res;
      this.lengthTable = this.registros.length;
    }, err => { console.error(err) })
    this.service.listarPerfiles().subscribe(res => {
      this.perfiles = res;
    }, err => { console.error(err) })
  }

  registroSeleccionado(e, id) { // e == evento // id del registro a filtrar
    let etiqueta = e.target as HTMLInputElement;
    let botonesEditar = document.getElementsByClassName('boton-editar');
    let checks = document.getElementsByClassName('testeo-registros');
    for (let i = 0; i < botonesEditar.length; i++) {
      if (etiqueta.checked) {
        (botonesEditar[i] as HTMLInputElement).disabled = true;
      } else {
        (botonesEditar[i] as HTMLInputElement).disabled = false;
      }
    }
    for (let i = 0; i < checks.length; i++) {
      if (etiqueta.checked) {
        (checks[i] as HTMLInputElement).disabled = true;
      } else {
        (checks[i] as HTMLInputElement).disabled = false;
      }
    }
    etiqueta.disabled = false;
    if (etiqueta.checked) {
      this.activeButton = true;
      this.registros.forEach(element => {
        if (element.id_item == id) this.registro = element;
      });
      console.log(this.registro);
      this.registro.perfiles.forEach(element => {
        let checkPerfil = document.getElementById("perfil-" + element.id_perfil) as HTMLInputElement;
        if (element.estado == 1) {
          checkPerfil.checked = true;
        } else {
          checkPerfil.checked = false;
        }
      })
      this.activePaginator = false;
    } else {
      let checks2 = document.getElementsByClassName('testeo-perfiles');
      for (let i = 0; i < checks2.length; i++) {
        (checks2[i] as HTMLInputElement).checked = false;
      }
      this.activeButton = false;
      this.activePaginator = true;
    }
  }

  // Cambiar la pagina
  cambiarPagina(e: PageEvent) {
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  modalAlerta(mensaje: string, accion: string) {
    this.switchModalAlerta = true;
    this.mensajeModal = mensaje;
  }

  cerrarModal(i) {
    if (i == 0) this.switchModal = false;
    if (i == 1) { 
      this.switchModalAlerta = false; 
      this.mensajeModal = ''; 
      this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['perfilamiento']));
    }
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'inputNombre') document.getElementById('spanNombre').style.display = 'none';
    if (id == 'inputEstado') document.getElementById('spanEstado').style.display = 'none';
  }
  atras() {
    this.router.navigateByUrl('perfilamiento', { skipLocationChange: true }).then(() => this.router.navigate(['home']));
  }
}
