import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatPaginatorModule } from "@angular/material";
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { PageEvent } from '@angular/material';

import { ArchivoPacService } from "../servicios/archivo-pac.service";
import { ArchivoPAC } from "../modelo/archivo-PAC";
import { CiudadPAC } from "../modelo/archivo-modelo";
import { IdNombre } from "../modelo/idNombre";
import { Rol } from "../modelo/rol";
import { Usuario } from '../modelo/usuario';
import { element } from "@angular/core/src/render3/instructions";
import { id } from "@swimlane/ngx-charts";

@Component({
  selector: "appcolp-archivo",
  templateUrl: "./archivo.component.html",
  styleUrls: ["./archivo.component.css"],
})
export class ArchivoComponent implements OnInit {

  usuario: Usuario | null = null;
  usuarios: Usuario[] | null = null;

  selectedCategoria: number = 0;
  selectedDepartamento: number = 0;
  selectedCiudad: number = 0;

  selectedDepartamento2: number = 0;
  selectedCiudad2: number = 0;

  categorias: IdNombre[];
  departamentos: IdNombre[];
  ciudades: IdNombre[];

  boletin: ArchivoComponent | null = null;
  boletines: ArchivoComponent[] | null = null;

  idNombre: IdNombre;
  elemento: CiudadPAC;
  parametros: ArchivoPAC[] | null = null;
  parametro: ArchivoPAC | null = null;
  presentacion: string | null = null
  rol: Rol

  // Paginacion
  parametrosLength: number = 0;
  pageSize: number = 5; // cantidad de registros a mostrar
  desde: number = 0; // desde que registro mostrar
  hasta: number = 5; // hasta que registro mostrar
  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  // Fin paginacion


  modalAbierto: number = null;
  // Modal
  switchModal: boolean = false;
  switchModalAlerta: boolean = false;
  switchModalFiltro: boolean = false;
  switchModalFiltro2: boolean = false;
  modalSwitchConfirmacion: boolean = false;
  mensajeModal: String = "";
  modalTitle: String = ""; // Titulo del modal
  accionFormulario: string = ""; // Accion del formulario
  // Fin Modal
  camposVacios: any = [];
  boolAccion: boolean = false;
  accion: string | null = null
  campos: boolean = false
  textoBotonConfirmacion: string | null = null;


  datosLength: number | null = null;

  constructor(
    private service: ArchivoPacService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.parametro) {
      this.accion = 'editar'
      this.listarRegistro();
    } else {
      this.accion = 'guardar'
      this.parametro = new ArchivoPAC();
      this.parametro.estado = 1;
    }

    this.parametro = new ArchivoPAC()
    this.listarRegistro();
    this.listarCategorias()
    this.listarDepartamentos();
    // this.cambiarSelects('ciudad2', true, '0');
  }

  cambiarSelects(id: string, disabled: boolean, value: string) {
    let input = document.getElementById(id) as HTMLSelectElement;
    input.disabled = disabled;
    input.value = value;
  }

  listarCiudades(id: number) {
    this.selectedCiudad = 0;
    this.service.listarCiudades(id).subscribe(res => {
      console.log(res)
      this.ciudades = res
      let input = document.getElementById('ciudad2') as HTMLSelectElement;
      input.disabled = false;
    }, err => {
      console.error(err)
      let input = document.getElementById('ciudad2') as HTMLSelectElement;
      input.disabled = true;
    });

  }

  listarDepartamentos() {
    this.service.listarDepartamentos().subscribe(res => {
      console.log(res)
      this.departamentos = res
    }, err => {
      console.error(err)
    });
  }

  listarCategorias() {
    this.service.listarCategorias().subscribe(res => {
      console.log(res)
      this.categorias = res
    }, err => {
      console.error(err)
    });
  }

  listarRegistro() {
    this.service.listarRegistros().subscribe(res => {
      this.parametros = res;
    }, err => { console.error(err) })
  }

  formulario(accion: string, id: number) {
    this.accionFormulario = accion
    this.switchModal = true;
    if (accion == "agregar") {
      this.modalTitle = "Agregar archivo";
      this.parametro = new ArchivoPAC()
      this.parametro.estado = null
      this.accion = "agregar";
    } if (accion == "editar") {
      this.accion = "editar";
      this.modalTitle = "Editar archivo";
      this.parametro = this.parametros.find(e => e.id == id)
    }

  }

  // Exportar excel
  exportExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.parametros);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'ArchivoPAC.xls', { bookType: 'xls', type: 'buffer' });
  }

  // Cambiar la pagina
  cambiarPagina(e: PageEvent) {
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  limpiarFiltros() {

    this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['archivoPAC']));
  }

  filtrar() {
    let departamento = (document.getElementById('departamento') as HTMLSelectElement).value;
    let ciudad = (document.getElementById('ciudad') as HTMLSelectElement).value;
    let envio = null;
    if (departamento == '' || departamento == undefined || departamento == null) {
      departamento = null;
    }
    if (ciudad == '' || ciudad == undefined || ciudad == null) {
      ciudad = null;
    }
    envio = {
      "departamento": {
        "id": departamento,
      },
      "ciudad": {
        "id": ciudad,
      },
    };

    console.log(envio);
    this.service.filtrar(envio).subscribe(res => {
      this.parametros = res;
      this.parametrosLength = this.parametros.length;
    }, err => console.error(err))

    this.cerrarModal(2);
  }

  cerrarModal(i) {
    if (i == 0) 
    this.switchModal = false;
    this.modalSwitchConfirmacion = false;
    if (i == 1) {
      this.switchModalAlerta = false; this.mensajeModal = '';
      this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['archivoPAC']));
    }
    if (i == 2) { this.switchModalFiltro = false; }
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'departamento2') document.getElementById('spanDepartamento').style.display = 'none';
    if (id == 'ciudad2') document.getElementById('spanCiudad').style.display = 'none';
    if (id == 'categoria') document.getElementById('spanCategoria').style.display = 'none';
  }

  abrirModalFiltro() {
    this.switchModalFiltro = true;
  }

  atras() {
    this.router.navigateByUrl('archivosPAC', { skipLocationChange: true }).then(() => this.router.navigate(['home']));
  }

  

  /********************************** */
  cambioEstado(e, id) {
    debugger;
    let input = e.target as HTMLInputElement;
    let elemento = this.usuarios.find(element => {
      return element.id == id
    })
    this.service.modificarRegistro(this.parametro).subscribe(res => {
      console.log(res)
    }, err => {
      console.error(err);
    });
  }

  confirmacion
    (accion: string, id: number) {
     //debugger;
    this.accion = accion;
    this.modalSwitchConfirmacion = true;
    this.parametros.forEach(e => {
      if (e.id == id) {
        this.parametro = e;
      }
    })
    if (accion == 'eliminar') {
      this.mensajeModal = "¿Estás seguro que deseas eliminar el archivo?";
      this.textoBotonConfirmacion = "Eliminar"
    }
    if (accion == 'guardar') {
      this.mensajeModal = "El Campo se ha agregado exitosamente"
      this.textoBotonConfirmacion = "Guardar"
    }
    if (accion == 'editar') {
      this.mensajeModal = "Se modifico el archivo correctamente"
      this.textoBotonConfirmacion = "Modificar"
    }
  }

  confirmar() {
    if (this.accion == 'eliminar') {
      this.service.borrarRegistro(this.parametro).subscribe(res => {
        console.log(res);
        this.alertaEliminar(res.status)
      }, err => {
        console.error(err);
        this.alertaEliminar(err.status)
      })
    }
  }
  
  alertaEliminar(status) {
    this.cerrarModal(0)
    if (status == '200') {  
      this.mensajeModal = 'Se elimino el archivo correctamente';
    } else {
      this.mensajeModal = 'Hubo un fallo al eliminar el archivo';
    }
    this.switchModalAlerta = true;
    //this.switchModal = false;
  }

  alerta(res, accion) {
    let accionString = '';
    this.cerrarModal(0)
    if (res == '200') {
      accionString = accion == 'agregar' ? 'agregó' :  'modificó'  
      this.mensajeModal = 'Se ' + accionString + ' el archivo correctamente';
    } else {
      accionString = accion == 'agregar' ? 'agregar' :  'modificar' 
      this.mensajeModal = 'Hubo un fallo al ' + accionString + ' el archivo';
    }
    this.switchModalAlerta = true;
    //this.switchModal = false;
  }

  validarLongitud(event) {
    let input = event.target as HTMLInputElement;
    if (input.id == 'nombre') {
      if (input.value.length == 100) { document.getElementById('spanNombreC').style.display = 'block'; }
      else if (input.value.length < 100) { document.getElementById('spanNombreC').style.display = 'none' }
    }
    if (input.id == 'horario') {
      if (input.value.length == 100) { document.getElementById('spanHorarioC').style.display = 'block'; }
      else if (input.value.length < 100) { document.getElementById('spanHorarioC').style.display = 'none' }
    }
    if (input.id == 'direccion') {
      if (input.value.length == 100) { document.getElementById('spanDireccionC').style.display = 'block'; }
      else if (input.value.length < 100) { document.getElementById('spanDireccionC').style.display = 'none' }
    }
    if (input.id == 'longitud') {
      if (input.value.length == 500) { document.getElementById('spanLongitudC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanLongitudC').style.display = 'none' }
    }
    if (input.id == 'latitud') {
      if (input.value.length == 500) { document.getElementById('spanlatitudC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanlatitudC').style.display = 'none' }
    }
    if (input.id == 'observaciones') {
      if (input.value.length == 500) { document.getElementById('spanObservacionesC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanObservacionesC').style.display = 'none' }
    }
  }

  guardarCambios() {
    // debugger
    this.campos = false;
    let nombre, selectedDepartamento2, selectedCiudad2, horario, direccion, longitud, latitud, selectedCategoria, observaciones;

    if (this.accionFormulario == "agregar") {
      observaciones = (document.getElementById('observaciones') as HTMLInputElement).value;
      selectedDepartamento2 = (document.getElementById('departamento2') as HTMLSelectElement).value;
      selectedCiudad2 = (document.getElementById('ciudad2') as HTMLSelectElement).value;
    }

    nombre = (document.getElementById('nombre') as HTMLInputElement).value;
    horario = (document.getElementById('horario') as HTMLInputElement).value;
    direccion = (document.getElementById('direccion') as HTMLInputElement).value;
    longitud = (document.getElementById('longitud') as HTMLInputElement).value;
    latitud = (document.getElementById('latitud') as HTMLInputElement).value;
    selectedCategoria = (document.getElementById('categoria') as HTMLSelectElement).value;



    if (
      (selectedDepartamento2 == '0' || selectedDepartamento2 == null || selectedDepartamento2 == undefined) &&
      this.accionFormulario == 'agregar'
      ) {
      this.campos = true;
      document.getElementById('departamento2').classList.add('campo-vacio');
      document.getElementById('spanDepartamento').style.display = 'block';
    }


    if (
      (selectedCiudad2 == null || selectedCiudad2 == undefined || selectedCiudad2 == "0") &&
      this.accionFormulario == 'agregar'
    ) {
      this.campos = true;
      document.getElementById('ciudad2').classList.add('campo-vacio');
      document.getElementById('spanCiudad').style.display = 'block';
    } else if(this.accionFormulario == 'agregar'){
      this.parametro.ciudad = new CiudadPAC();
      this.parametro.ciudad.id = parseInt(selectedCiudad2);
    }

    if (nombre == null || nombre == undefined || nombre == "") {
      this.campos = true;
      document.getElementById('nombre').classList.add('campo-vacio');
      document.getElementById('spanNombre').style.display = 'block';
    } else {
      this.parametro.nombre = nombre;
    }

    if (horario == null || horario == undefined || horario == "") {
      this.campos = true;
      document.getElementById('horario').classList.add('campo-vacio');
      document.getElementById('spanHorario').style.display = 'block';
    } else {
      this.parametro.horario = horario;
    }

    if (direccion == null || direccion == undefined || direccion == "") {
      this.campos = true;
      document.getElementById('direccion').classList.add('campo-vacio');
      document.getElementById('spanDireccion').style.display = 'block';
    } else {
      this.parametro.direccion = direccion;
    }

    if (longitud == null || longitud == undefined || longitud == "") {
      this.campos = true;
      document.getElementById('longitud').classList.add('campo-vacio');
      document.getElementById('spanLongitud').style.display = 'block';
    } else {
      this.parametro.longitud = parseInt(longitud);
    }

    if (latitud == null || latitud == undefined || latitud == "") {
      this.campos = true;
      document.getElementById('latitud').classList.add('campo-vacio');
      document.getElementById('spanLatitud').style.display = 'block';
    } else {
      this.parametro.latitud = parseInt(latitud);
    }

    if (selectedCategoria == null || selectedCategoria == undefined || selectedCategoria == "0") {
      this.campos = true;
      document.getElementById('categoria').classList.add('campo-vacio');
      document.getElementById('spanCategoria').style.display = 'block';
    } else {
      this.parametro.categoria = new IdNombre()
      this.parametro.categoria.id = parseInt(selectedCategoria);
    }

    if (
      (observaciones == null || observaciones == undefined || observaciones == "") &&
      this.accionFormulario == 'agregar'
      ) {
      this.campos = true;
      document.getElementById('observaciones').classList.add('campo-vacio');
      document.getElementById('spanObservaciones').style.display = 'block';
    }
     else if(this.accionFormulario == 'agregar'){
      this.parametro.observacion = observaciones
    }

    if (this.campos == false) {
      if (this.accionFormulario == "agregar") {
        this.parametro.estado = 1
        this.parametro.id = null
      }

      console.log( JSON.stringify(this.parametro))

      this.service.guardarCambios(this.parametro, this.accionFormulario).subscribe(res => {
        this.alerta('200', this.accionFormulario)
      }, err => {
        console.error(err);
        this.alerta('400', this.accionFormulario)
      });

    }
  }


  cambiarEstado(event, id: number) {
    this.parametros.forEach(item => {
      if (item.id == id) {
        this.parametro = item;
        if (item.estado == 0) {
          item.estado = 1;
          this.parametro.estado = 1;
        } else {
          item.estado = 0;
          this.parametro.estado = 0;
        }
      }
    });
    this.service.modificarRegistro(this.parametro).subscribe(res => {
      let label = this.parametro.estado > 0 ? "Activo" : "Inactivo";
      document.getElementById("slideEstado-" + id).innerText = label;
    }, err => console.error(err))
  }

  ajustarTamano(valor){
    let table = document.getElementById('table-registros') as HTMLElement;
    if(valor == 1) table.style.width = '140%';
    if(valor == 2) table.style.width = '100%';
  }
}


  // abrirModal(i) { // abrir modal de opciones de alianzas
  //   if (this.modalAbierto != i && this.modalAbierto != null) {
  //     document.getElementById("modal" + this.modalAbierto).style.display = "none";
  //     this.modalAbierto = null;
  //   }
  //   if (this.modalAbierto == null) {
  //     document.getElementById("modal" + i).style.display = "block";
  //     this.modalAbierto = i;
  //   } else {
  //     this.modalAbierto = null;
  //     document.getElementById("modal" + i).style.display = "none";
  //   }
  // }