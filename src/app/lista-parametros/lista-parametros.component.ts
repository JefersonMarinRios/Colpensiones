import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ParametrosService } from '../servicios/parametros.service';
import { Parametros } from '../modelo/parametros';

import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { exit } from 'process';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material';



@Component({
  selector: 'appcolp-lista-parametros',
  templateUrl: './lista-parametros.component.html',
  styleUrls: ['./lista-parametros.component.css']
})
export class ListaParametrosComponent implements OnInit {

  parametros: Parametros[];
  parametro: Parametros;
  parametro_test: any = [];
  dialogRef: any;

  // Paginacion
  parametrosLength: number = 0;
  pageSize: number = 5; // cantidad de registros a mostrar
  desde: number = 0; // desde que registro mostrar
  hasta: number = 5; // hasta que registro mostrar
  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  // Fin paginacion

  // Modal
  switchModal: boolean = false;
  switchModalAlerta: boolean = false;
  switchModalFiltro: boolean = false;
  mensajeModal: String = "";
  modalTitle: String = ""; // Titulo del modal
  accionFormulario: string = ""; // Accion del formulario
  // Fin Modal
  campos: boolean = false;

  
  alertaFechas: boolean = false;
  mensajeAlertaFechas: string | null = '';


  constructor(private parametroService: ParametrosService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router) {
    this.parametros = new Array<Parametros>();
    this.parametro = new Parametros();
    this.switchModalFiltro = false;
    parametroService.listarTodo().subscribe(res => {
      this.parametros = res;
      res.forEach(element => {
        let { id, nombre, valor, descripcion, estado } = element;
        let newParametro = {
          id: id,
          nombre: nombre,
          valor: valor.trim(),
          descripcion: descripcion,
          estado: estado 
          // estado: (estado == 1) ? "Habilitado": "Deshabilitado" 
        }
        this.parametro_test.push(newParametro);
      });
      console.log(this.parametros);
    }, error => { console.log(error); });
  }

  ngOnInit() {
    this.switchModalFiltro = false;
    this.parametro = new Parametros()
    this.parametro = {
      descripcion: "",
      estado: null,
      nombre: "",
      valor: "",
      id: null
    }
  }

  cambiarPagina(e: PageEvent) {
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }



  validarLongitud(event){
    let input = event.target as HTMLInputElement;
    if (input.id == 'inputNombre') {
      if (input.value.length == 50) { document.getElementById('spanNombreC').style.display = 'block'; }
      else if (input.value.length < 50) { document.getElementById('spanNombreC').style.display = 'none' }
    }
    if (input.id == 'inputValor') {
      if (input.value.length == 500) { document.getElementById('spanValorC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanValorC').style.display = 'none' }
    }
    if (input.id == 'inputDescripcion') {
      if (input.value.length == 500) { document.getElementById('inputDescripcionC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('inputDescripcionC').style.display = 'none' }
    }
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'inputNombre') document.getElementById('spanNombre').style.display = 'none';
    if (id == 'inputValor') document.getElementById('spanValor').style.display = 'none';
    if (id == 'inputDescripcion') document.getElementById('spanDescripcion').style.display = 'none';
    if (id == 'inputEstado') document.getElementById('spanEstado').style.display = 'none';
  }

  formulario(accion, id) {
    if (accion == "agregar") {
      this.modalTitle = "Agregar parámetro";
      this.parametro = {
        descripcion: "",
        estado: null,
        nombre: "",
        valor: "",
        id: null
      };
      this.accionFormulario = "agregar";
    } else if (accion == "editar") {
      this.accionFormulario = "editar";
      this.modalTitle = "Editar parámetro";
      this.parametro = this.parametro_test.find(element => {
        return element.id == id;
      });
      console.log(this.parametro);
    }
    this.switchModal = true;
  }


  envioFormulario(action: String) {
    let mensaje = "";
    // Validacion de campos 
    this.campos = false;
    let inputNombre = document.getElementById('inputNombre') as HTMLInputElement;
    let inputValor = document.getElementById('inputValor') as HTMLInputElement;
    let inputEstado = document.getElementById('inputEstado') as HTMLInputElement;
  
    // debugger;
    if(inputNombre.value == '' || inputNombre.value == undefined){
      this.campos = true;
      document.getElementById('inputNombre').classList.add('campo-vacio');
      document.getElementById('spanNombre').style.display = 'block';
    }else{
      this.parametro.nombre = inputNombre.value;
    }
    if(inputValor.value == '' || inputValor.value == undefined){
      this.campos = true;
      document.getElementById('inputValor').classList.add('campo-vacio');
      document.getElementById('spanValor').style.display = 'block';
    }else{
      this.parametro.valor = inputValor.value;
    }
    if(inputEstado.value == 'null' || inputEstado.value == undefined || inputEstado.value == null){
      this.campos = true;
      document.getElementById('inputEstado').classList.add('campo-vacio');
      document.getElementById('spanEstado').style.display = 'block';
    }else{
      this.parametro.estado = parseInt(inputEstado.value);
    }

    //Validacion parecida a la de arriba

    // Fin validacion de campos 

    if(this.campos == false){
      if (action == "agregar") {
        this.parametroService.agregar(this.parametro).subscribe(res => {
            console.log(res)
            this.alerta('200', action)
          }, err => { 
            console.error(err);
            this.alerta('400', action) 
          }
        );
      } else if (action == "editar") {
        this.parametroService.actualizar(this.parametro).subscribe(res => {
            console.log(res)
            this.alerta('200', action)
          }, err => { 
            console.error(err);
            this.alerta('400', action) 
          }
        );
      }
    }
  }

  exportExcel() {

    let newArray = [];

    this.parametro_test.forEach(element => {
      let { id, nombre, valor, descripcion, estado } = element;
      let newParametro = {
        id: id,
        nombre: nombre,
        valor: valor.trim(),
        descripcion: descripcion,
        // estado: estado 
        estado: (estado == 1) ? "Habilitado": "Deshabilitado" 
      }
      newArray.push(newParametro);
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'parametros.xls', { bookType: 'xls', type: 'buffer' });
  }

  limpiarFiltros() {
    this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['parametros']));
  }

  filtrar() {
    let nombre = (document.getElementById('filtroNombre') as HTMLInputElement).value;
    let estado = (document.getElementById('filtroEstado') as HTMLSelectElement).value;
    let estadoenvio = 0;
    let envio = null;

    if (nombre == '' || nombre == undefined || nombre == null) {
      nombre = null;
    }
    if (estado == 'null' || estado == undefined || estado == null) {
      estadoenvio = null;
    }else{
      estadoenvio = parseInt(estado);
    }
    envio = {
      "nombre": nombre,
      "estado": estadoenvio
    }

    console.log(envio)
    this.parametroService.filtrar(envio).subscribe(res=>{
      this.parametros = res;
      this.parametrosLength = this.parametros.length;
    }, err => console.error(err))
    
    this.cerrarModal(2);
  }

  abrirModalFiltro(){
    this.switchModalFiltro = true;
  }

  cerrarModal(i){
    if(i == 0) this.switchModal = false;
    if(i == 1){
      this.switchModal = false;
      this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['parametros']));
    }
    if(i == 2) {
      this.switchModalFiltro = false;
    }
  }

  alerta(respuesta, accion) {
    let accionString = '';
    this.cerrarModal(0)
    if (respuesta == '200') {
      accionString = accion == 'agregar' ? 'agregado' : 'modificado'
      this.mensajeModal = 'El parámetro se ha ' + accionString + ' exitosamente';
    } else {
      accionString = accion == 'editar' ? 'guardar' : 'modificar'
      this.mensajeModal = ' Gracias por tu paciencia, tuvimos un inconveniente al  ' + accionString + ' el parámetro';
    }
    this.switchModalAlerta = true;
  }
}
