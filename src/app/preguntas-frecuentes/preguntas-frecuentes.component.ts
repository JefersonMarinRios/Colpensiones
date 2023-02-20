import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
// service
import { PreguntasFrecuentesService } from '../servicios/preguntas-frecuentes.service';
// models
import { CategoriaPreguntas } from '../modelo/categoria-preguntas';
import { PreguntaPreguntas } from '../modelo/pregunta-preguntas';

@Component({
  selector: 'appcolp-preguntas-frecuentes',
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrls: ['./preguntas-frecuentes.component.css']
})
export class PreguntasFrecuentesComponent implements OnInit {


  enviarPUSH: boolean = false; // Interruptor para mostrar formulario PUSH
  boletin: CategoriaPreguntas | null = null;
  boletines: CategoriaPreguntas[] | null = null;
  modalAbierto: number = null; // modal abierto opciones categoria 
  // Modal
  modalSwitch: boolean = false; // interruptor para mostrar modal
  modalSwitchConfirmacion: boolean = false; // interruptor para mostrar modal confirmación
  mensajeModal: String = ""; // mensaje modal alerta
  switchModalAlerta: boolean = false; // interruptor modal alerta

  accion: string | null = null; // identificar la accion realizada 
  textoBotonConfirmacion: string | null = null;

  presentacion: string | null = null; // cambiar la presentacion de los registros, valores 'tabla' 'iconos'

  file: any | null;
  tituloModal: string = null; // Titulo del modal
  campos: boolean = false;

  // Paginacion
  tamanoTabla: number = 0;
  pageSize: number = 5; // cantidad de registros a mostrar
  desde: number = 0; // desde que registro mostrar
  hasta: number = 5; // hasta que registro mostrar
  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;

  idCategoria: number | null = null;
  nombreCategoria: string | null = null;
  ruta: string = '';

  constructor(
    private router: Router,
    private service: PreguntasFrecuentesService,
    private route: ActivatedRoute,
  ) {
    this.route
      .queryParamMap
      .subscribe(e => {
        this.idCategoria = parseInt(e.get('opc')); // parametro opc es el id de la alianza
        this.nombreCategoria = e.get('opc2'); // parametro opc es el id de la alianza
      });
  }

  ngOnInit() {
    if (this.idCategoria == null || this.idCategoria == undefined || Number.isNaN(this.idCategoria)) {
      this.ruta = '/preguntasFrecuentes/sub'
    } else {
      this.ruta = '/preguntasFrecuentes/sub/lista'
    }

    this.presentacion = 'iconos'
    this.listarBoletines();
  }

  listarBoletines() {
    this.boletin = new CategoriaPreguntas();
    if (this.idCategoria == null || this.idCategoria == undefined || Number.isNaN(this.idCategoria)) {
      this.service.listarCategoriasPrincipales(false).subscribe(res => {
        this.boletines = res;
        this.tamanoTabla = this.boletines.length;
      }, err => {
        console.log(err);
      })
    } else {
      this.service.getCategoriaPreguntas(this.idCategoria).subscribe(res => {
        console.log(res);
        let categorias: CategoriaPreguntas[] = res.categorias;
        console.log(categorias)
        this.nombreCategoria = res.nombre;
        this.boletines = categorias;
        this.tamanoTabla = this.boletines.length;
      }, err => {
        console.log(err);
      })
    }
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
    this.service.modificarCategoria(this.boletin).subscribe(res => {
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
    if (i == 2) {
      this.modalSwitch = false;
      this.tituloModal = null;
      // aca la definicioón del objeto de la red social en null
      this.accion = null;
      this.boletin = new CategoriaPreguntas();
    }
  }

  confirmar() {
    debugger;
    let status;
    if (this.accion == 'eliminar') {
      this.service.borrarCategoria(this.boletin.id).subscribe(res => {
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
      if (this.idCategoria == null || this.idCategoria == undefined || Number.isNaN(this.idCategoria)) {
        this.boletin.categoria = null
      } else {
        this.boletin.categoria.id = this.idCategoria
      }
      this.service.crearCategoria(this.boletin).subscribe(res => {
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
      // accionString = accion == 'duplicar' ? 'duplicó' : 'eliminó'
      if (accion == 'duplicar') accionString = 'duplicó';
      if (accion == 'eliminar') accionString = 'eliminó';
      if (accion == 'guardar') { accionString = 'guardó'; this.modalSwitch = false; }
      if (accion == 'actualizar') { accionString = 'modificó'; this.modalSwitch = false; }
      this.mensajeModal = 'Se ' + accionString + ' la categoria correctamente';
    } else {
      if (accion == 'duplicar') accionString = 'duplicar';
      if (accion == 'eliminar') accionString = 'eliminar';
      if (accion == 'guardar') { accionString = 'guardar'; this.modalSwitch = false; }
      if (accion == 'actualizar') { accionString = 'modificar'; this.modalSwitch = false; }
      // accionString = accion == 'duplicar' ? 'duplicar' : 'eliminar'
      this.mensajeModal = 'Hubo un fallo al ' + accionString + ' la categoria';
    }
    this.switchModalAlerta = true;
  }

  confirmacion(accion: string, id: number) {
    // debugger;
    this.accion = accion;
    this.modalSwitchConfirmacion = true;
    this.boletines.forEach(e => {
      if (e.id == id) {
        if (this.idCategoria == null || this.idCategoria == undefined || Number.isNaN(this.idCategoria)) {
          this.boletin = e;
        } else {
          this.boletin = {
            id: e.id,
            nombre: e.nombre,
            url: e.url,
            estado: e.estado,
            icono: e.icono,
            categoria: {
              id: this.idCategoria
            }
          }
        }
      }
    })

    if (accion == 'duplicar') {
      this.mensajeModal = "¿Estás seguro que deseas duplicar la categoria?";
      this.textoBotonConfirmacion = "Duplicar"
    }
    if (accion == 'eliminar') {
      this.mensajeModal = "¿Estás seguro que deseas eliminar la categoria?";
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

  anadirImagenModal(item) {
    let type = 'image/png';
    const byteCharacters = atob(item.imagen);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: type });
    const imageFile: File = new File([blob], item.nombre, {
      type: "image/png"
    });
    let generatedImage = window.URL.createObjectURL(imageFile);
    document.getElementById('imagen-recuadro-excel').setAttribute('src', generatedImage);
  }

  abrirCarga() {
    document.getElementById("cargaImagen").click();
  }

  addFile(files) {
    this.file = files.item(0);
    if (this.file != null) {
      this.getBase64(this.file).then(data => {
        // console.log(data);
        let prueba = data.toString().split(',');
        this.boletin.icono = prueba[1];
      });
    }
    document.getElementById('recuadro-excel').classList.remove('campo-vacio');
    document.getElementById('spanImagen').style.display = 'none';
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let data = reader.result;
        let imagen = (document.getElementById('imagen-recuadro-excel') as HTMLImageElement);
        imagen.src = reader.result.toString();
        resolve(data);
      }
      reader.onerror = error => reject(error);
    })
  }

  abrirModalAccion(accion: string, id: number, i) { // muestra el formulario de registro o modificacion de la alianza
    this.modalSwitch = true;
    if (accion == "guardar") {
      this.boletin = new CategoriaPreguntas();
      this.tituloModal = "Crear categoría";
    } else if (accion == "actualizar") {
      this.tituloModal = "Modificar categoría";

      this.boletines.forEach(item => {
        if (item.id == id) {
          this.boletin = item;
        }
      })
    }
    this.accion = accion;
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'nombre') document.getElementById('spanNombre').style.display = 'none';
    if (id == 'descripcion') document.getElementById('spanDescripcion').style.display = 'none';
  }

  guardarCambios() {
    let mensaje = "";
    this.campos = false;

    if (this.boletin.nombre == '' || this.boletin.nombre == null || this.boletin.nombre == undefined) {
      this.campos = true;
      document.getElementById('nombre').classList.add('campo-vacio');
      document.getElementById('spanNombre').style.display = 'block';
    }
    // if (this.boletin.url == '' || this.boletin.url == null || this.boletin.url == undefined) {
    //   this.campos = true;
    //   document.getElementById('descripcion').classList.add('campo-vacio');
    //   document.getElementById('spanDescripcion').style.display = 'block';
    // }
    if (this.boletin.icono == '' || this.boletin.icono == null || this.boletin.icono == undefined) {
      this.campos = true;
      document.getElementById('recuadro-excel').classList.add('campo-vacio');
      document.getElementById('spanImagen').style.display = 'block';
    }

    if (this.campos == false) {
      if (this.accion == "guardar") {
        this.boletin.estado = 1;
        this.boletin.id = null;
        if (this.idCategoria == null || this.idCategoria == undefined || Number.isNaN(this.idCategoria)) {
          this.boletin.categoria = null
        } else {
          this.boletin.categoria.id = this.idCategoria
        }

        this.service.crearCategoria(this.boletin).subscribe(res => {
          this.alerta(this.accion, 200);
        }, err => {
          this.alerta(this.accion, 400);
          console.error(err)
        })
      } else if (this.accion == "actualizar") {
        this.service.modificarCategoria(this.boletin).subscribe(res => {
          this.alerta(this.accion, 200);
        }, err => {
          this.alerta(this.accion, 400);
          console.error(err)
        })
      }
    }
  }

  atras() {
    this.router.navigateByUrl('preguntasFrecuentes', { skipLocationChange: true }).then(() => this.router.navigate(['home']));
  }
}
