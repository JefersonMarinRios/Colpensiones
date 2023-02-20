import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material';
import { UsuarioService } from '../servicios/usuario.service';
import { Usuario } from '../modelo/usuario';
import { Rol } from '../modelo/rol';
import { RolService } from '../servicios/rol.service';

@Component({
  selector: 'appcolp-administracion-usuarios',
  templateUrl: './administracion-usuarios.component.html',
  styleUrls: ['./administracion-usuarios.component.css']
})
export class AdministracionUsuariosComponent implements OnInit {

  // Objetos de datos
  usuario: Usuario | null = null;
  usuarios: Usuario[] | null = null;

  roles: Rol[] | null = null;
  rolSeleccionado: Rol | null = null
  // Fin objetos de datos

  // Paginacion
  usuariosLength: number = 0;
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

  // Validacion de campos
  campos: boolean = false

  // otros
  usuarioLog: Usuario | null = null;
  presentacion: string | null = null

  constructor(
    private service: UsuarioService,
    private serviceRol: RolService,
    private router: Router,
    public snackbar: MatSnackBar,
  ) {
    // this.newUsuario();
    this.usuario = new Usuario();
    this.usuarioLog = JSON.parse(localStorage.getItem('usuarioColp'));
    if(this.usuarioLog.colpRol.id != 1) this.router.navigate(['home']);
  }

  ngOnInit() {
    this.listarTodo();
    this.listarRol();
  }

  listarTodo() {
    this.service.listarTodo().subscribe(res => {
      this.usuarios = res;
      this.usuariosLength = this.usuarios.length;
    }, err => console.error(err))
  }

  listarRol() {
    this.serviceRol.listarTodo().subscribe(res => {
      this.roles = res;
    }, err => console.error(err))
  }

  // Exportar excel
  exportExcel() {
    let newList = [];
    this.usuarios.forEach(e => {
      let newItem = {
        id: e.id,
        colpRol: e.colpRol.nombre,
        nombre: e.nombre,
        correo: e.correo,
        estado: e.estado == 1 ? 'Habilitado' : 'Deshabilitado', 
        fecha_creacion: e.fecha_creacion,
        fecha_actualizacion: e.fecha_actualizacion
      }
      newList.push(newItem);
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newList);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'lista-usuarios.xls', { bookType: 'xls', type: 'buffer' });
  }

  // Cambiar la pagina
  cambiarPagina(e: PageEvent) {
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  formulario(accion, id) {
    if (accion == "agregar") {
      this.modalTitle = "Agregar usuario";
      this.usuario = new Usuario();
      this.usuario.nombre = '';
      this.usuario.correo = '';
      this.rolSeleccionado = new Rol();
      this.accionFormulario = "agregar";
    } else if (accion == "editar") {
      this.accionFormulario = "editar";
      this.modalTitle = "Editar usuario";

      // this.usuarios.forEach(e => {
      //   if(e.id == id) this.usuario = e;
      // });
      this.usuario = this.usuarios.find(e => e.id == id)
      console.log(this.usuario);
      this.rolSeleccionado = this.roles.find(element => {
        return element.id == this.usuario.colpRol.id;
      })
    }
    this.switchModal = true;
  }

  envioFormulario() {
    this.campos = false;
    let inputRol = (document.getElementById('inputRol') as HTMLInputElement).value;
    // let inputCorreo = (document.getElementById('inputCorreo') as HTMLInputElement).value;
    let inputNombre = (document.getElementById('inputNombre') as HTMLInputElement).value;
    let inputCorreo;
    if (this.accionFormulario == "agregar") inputCorreo = (document.getElementById('inputCorreo') as HTMLInputElement).value;

    if ((inputCorreo == '' || inputCorreo == null || inputCorreo == undefined) && this.accionFormulario == "agregar") {
      this.campos = true;
      document.getElementById('inputCorreo').classList.add('campo-vacio');
      document.getElementById('spanCorreo').style.display = 'block';
    } else if(this.accionFormulario == "agregar") this.usuario.correo = inputCorreo;

    if (inputNombre == null || inputNombre == undefined || inputNombre == "") {
      this.campos = true;
      document.getElementById('inputNombre').classList.add('campo-vacio');
      document.getElementById('spanNombre').style.display = 'block';
    } else this.usuario.nombre = inputNombre;
    
    if (inputRol == null || inputRol == undefined || inputRol == "") {
      this.campos = true;
      document.getElementById('inputRol').classList.add('campo-vacio');
      document.getElementById('spanRol').style.display = 'block';
    } else {
      this.usuario.colpRol = this.roles.find(element => {
        return element.id == parseInt(inputRol);
      })
    }

    if (this.campos == false) {
      if (this.accionFormulario == "agregar") {
        this.usuario.estado = 1;
        this.usuario.id = null;
        let envio = {
          "colpRol": {
            "id": this.usuario.colpRol.id
          },
          "nombre": this.usuario.nombre,
          "correo": this.usuario.correo,
          "estado": 1
        }
        // console.log(envio);
        console.log(this.usuario);
        this.service.agregar(envio).subscribe(res => {
          this.alerta(res, this.accionFormulario)
        }, err => {
          console.error(err);
          this.alerta(err, this.accionFormulario)
        });
      } else if (this.accionFormulario == "editar") {
        let envio = {
          "colpRol": {
            "id": this.usuario.colpRol.id
          },
          "nombre": this.usuario.nombre,
          "correo": this.usuario.correo,
          "estado": this.usuario.estado
        }
        console.log(envio);
        this.service.editar(envio, this.usuario.id).subscribe(res => {
          this.alerta(res, this.accionFormulario)
        }, err => {
          console.error(err);
          this.alerta(err, this.accionFormulario)
        });
      }
    }
  }

  alerta(res, accion) {
    let accionString = '';
    this.cerrarModal(0)
    if (res.status == '200') {
      accionString = accion == 'agregar' ? 'agregó' : 'modificó'
      this.mensajeModal = 'Se ' + accionString + ' el usuario correctamente';
    } else {
      accionString = accion == 'agregar' ? 'agregar' : 'modificar'
      this.mensajeModal = 'Hubo un fallo al ' + accionString + ' el usuario';
    }
    this.switchModalAlerta = true;
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'inputNombre') document.getElementById('spanNombre').style.display = 'none';
    if (id == 'inputRol') document.getElementById('spanRol').style.display = 'none';
  }

  cerrarModal(i) {
    if (i == 0) this.switchModal = false;
    if (i == 1) {
      this.switchModalAlerta = false; 
      this.mensajeModal = '';
      this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['users']));
    }
    if (i == 2) this.switchModalFiltro = false; 
  }

  limpiarFiltros() {
    this.router.navigateByUrl('estadistica', { skipLocationChange: true }).then(() => this.router.navigate(['users']));
  }

  filtrar() {
    let nombre = (document.getElementById('filtroNombre') as HTMLInputElement).value;
    let usuario = (document.getElementById('filtroUsuario') as HTMLInputElement).value;
    let rol = (document.getElementById('filtroRol') as HTMLSelectElement).value;
    let envio = null;
    let objRol = null;
    if (nombre == '' || nombre == undefined || nombre == null) {
      nombre = null;
    }
    if (usuario == '' || usuario == undefined || usuario == null) {
      usuario = null;
    }
    if (rol == 'null' || rol == undefined || rol == null) {
      objRol = null
    } else {
      objRol = this.roles.find(e => {
        return e.id == parseInt(rol)
      })
    }
    envio = {
      "nombre": nombre,
      "correo": usuario,
      "colpRol": objRol
    };

    console.log(envio);
    this.service.filtrar(envio).subscribe(res => {
      console.log(res);
      this.usuarios = res;
      this.usuariosLength = this.usuarios.length;
    }, err => console.error(err))

    this.cerrarModal(2);
  }

  cambioEstado(e, id) {
    let input = e.target as HTMLInputElement;
    let elemento = this.usuarios.find(element => {
      return element.id == id
    })
    let valor = input.checked == true ? 1 : 0;
    let envio = {
      "colpRol": {
        "id": elemento.colpRol.id
      },
      "nombre": elemento.nombre,
      "correo": elemento.correo,
      "estado": valor
    }
    this.service.editar(envio, id).subscribe(res => {
      console.log(res)
    }, err => {
      console.error(err);
    });
  }

  abrirModalFiltro() {
    this.switchModalFiltro = true;
  }
  atras() {
    this.router.navigateByUrl('administracion-usuarios', { skipLocationChange: true }).then(() => this.router.navigate(['home']));
  }
}
