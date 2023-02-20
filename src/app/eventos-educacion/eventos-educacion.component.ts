import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventosEducacionService } from '../servicios/eventos-educacion.service';
import { EventosEducacion } from '../modelo/eventos-educacion';
import { MatPaginatorModule, PageEvent } from '@angular/material';
import { RolService } from '../servicios/rol.service';
import { Usuario } from '../modelo/usuario';
import * as XLSX from 'xlsx';
import { Departamento, IdNombre, Municipio, Region } from '../modelo/idNombre';

@Component({
  selector: 'appcolp-eventos-educacion',
  templateUrl: './eventos-educacion.component.html',
  styleUrls: ['./eventos-educacion.component.css']
})
export class EventosEducacionComponent implements OnInit {

  selectedRegion: number=0;
  selectedDepartamento: number=0;
  selectedMunicipio: number=0;
  // regiones: IdNombre[] | null = null;
  // departamentos: IdNombre[] | null = null;
  // municipios: IdNombre[] | null = null;

  regiones: Region[] | null = null;
  departamentos: Departamento[] | null = null;
  municipios: Municipio[] | null = null;

  enviarPUSH: boolean = false; // Interruptor para mostrar formulario PUSH
  boletin: EventosEducacion | null = null;
  boletines: EventosEducacion[] | null = null;

  // Objetos de datos
  usuario: Usuario | null = null;
  // usuario: any | null = null;
  usuarios: Usuario[] | null = null;

  idNombre: IdNombre[] | null = null;
  // Fin objetos de datos

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

  // Fin paginacion
  // Modal
  switchModal: boolean = false;
  switchModalAlertas: boolean = false;
  switchModalFiltro: boolean = false;
  mensajeModals: String = "";
  modalTitle: String = ""; // Titulo del modal
  accionFormulario: string = ""; // Accion del formulario
  // Fin Modal

  // Validacion de campos
  campos: boolean = false

  //otros
  nombreActual: any;



  constructor(
    private router: Router,
    private serviceRol: RolService,
    private service: EventosEducacionService
  ) { }

  atras() {
    this.router.navigateByUrl('seccionEducacion', { skipLocationChange: true }).then(() => this.router.navigate(['seccionEducacion']));
  }

  ngOnInit() {
    this.presentacion = 'iconos'
    this.listarBoletines();
    this.listarLugares();
    //this.listarDepartamentos();
    let input = document.getElementById('departamento') as HTMLSelectElement;
    input.disabled = true;

    let input2 = document.getElementById('municipio') as HTMLSelectElement;
    input.disabled = true;
  }

  listarLugares(){
    this.service.listarLugares().subscribe(res => {
      console.log(res)
      this.regiones=res.regiones
      this.departamentos=res.departamentos
      this.municipios=res.municipios
    }, err => {
      console.error(err)
    });  
  }


  listarRegiones() {
    this.service.listarRegiones().subscribe(res => {
      console.log(res)
      this.regiones = res
    }, err => {
      console.error(err)
    });
  }

  listarDepartamentos(id: number) {
    this.service.listarDepartamentos(id).subscribe(res => {
      console.log(res)
      this.departamentos = res
      let input = document.getElementById('departamento') as HTMLSelectElement;
      input.disabled = false;
    }, err => {
      console.error(err)
      let input = document.getElementById('departamento') as HTMLSelectElement;
      input.disabled = true;
    });
  }

  listarMunicipios(id: number) {
    debugger

    this.service.listarMunicipios(id).subscribe(res => {
      console.log(res)
      this.municipios = res
      let input = document.getElementById('municipio') as HTMLSelectElement;
      input.disabled = false;
    }, err => {
      console.error(err)
      let input = document.getElementById('municipio') as HTMLSelectElement;
      input.disabled = true;
    });
  }

  listarBoletines() {
    this.boletin = new EventosEducacion();
    this.service.listarEventos().subscribe(res => {
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
    this.service.editarEvento(this.boletin).subscribe(res => {
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
      this.service.eliminarEvento(this.boletin.id).subscribe(res => {
        status = 200;
        console.log(res);
        this.alerta(this.accion, status)
      }, err => {
        status = 400;
        console.error(err);
      })
    } if (this.accion == 'duplicar') {
      this.boletin.id = null;
      this.boletin.nombre = this.boletin.nombre + ' copia'
      this.service.crearEvento(this.boletin).subscribe(res => {
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
      this.mensajeModal = 'Se ' + accionString + ' el evento correctamente';
    } else {
      accionString = accion == 'duplicar' ? 'duplicar' : 'eliminar'
      this.mensajeModal = 'Hubo un fallo al ' + accionString + ' el evento';
    }
    this.switchModalAlerta = true;
  }

  confirmacion
    (accion: string, id: number) {
    // debugger;
    this.accion = accion;
    this.modalSwitchConfirmacion = true;
    this.boletines.forEach(e => {
      if (e.id == id) {
        this.boletin = e;
      }
    })

    if (accion == 'duplicar') {
      this.mensajeModal = "¿Estás seguro que deseas duplicar el evento?";
      this.textoBotonConfirmacion = "Duplicar"
    }
    if (accion == 'eliminar') {
      this.mensajeModal = "¿Estás seguro que deseas eliminar el evento?";
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


  limpiarFiltros() {
    
    this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['seccionEducacion/eventos']));
  }

  filtrar() {
    // debugger;
    let listarRegiones = (document.getElementById('region') as HTMLSelectElement).value;
    let listarDepartamentos = (document.getElementById('departamento') as HTMLSelectElement).value;
    let listarMunicipios = (document.getElementById('municipio') as HTMLSelectElement).value;
    this.service.listarEventoMunicipio(this.selectedMunicipio).subscribe(res => {
      console.log(res);
      this.boletines=res
    }, err => console.error(err))
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'region') document.getElementById('spanRegion').style.display = 'none';
    if (id == 'municipio') document.getElementById('spanMunicipio').style.display = 'none';
    if (id == 'departamento') document.getElementById('spanDepartamento').style.display = 'none';
  }

  // Exportar excel
  exportExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.usuarios);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'parametros.xls', { bookType: 'xls', type: 'buffer' });
  }

  abrirModalFiltro() {
    this.switchModalFiltro = true;
  }
}

