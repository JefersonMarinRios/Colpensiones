import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CategoriaAlianzas } from '../modelo/categoria-alianzas';
import { AlianzasBienestarService } from '../servicios/alianzas-bienestar.service';


@Component({
  selector: 'appcolp-alianzas',
  templateUrl: './alianzas.component.html',
  styleUrls: ['./alianzas.component.css']
})
export class AlianzasComponent implements OnInit {

  enviarPUSH: boolean = false; // Interruptor para mostrar formulario PUSH
  categoria: CategoriaAlianzas | null = null; // Objeto categoria 
  categorias: CategoriaAlianzas[] | null = null; // Objeto array categoria 
  modalAbierto: number = null; // modal abierto opciones categoria 
  // Modal
  modalSwitch: boolean = false; // interruptor para mostrar modal
  modalSwitchConfirmacion: boolean = false; // interruptor para mostrar modal confirmación
  mensajeModal: String = ""; // mensaje modal alerta
  switchModalAlerta: boolean = false; // interruptor modal alerta
  textoBotonConfirmacion: string | null = null;

  tituloModal: string = null; // Titulo del modal
  accion: string = null; // accion registrar o modificar
  // File
  file: File | null = null;
  presentacion: string | null = null;
  

  // Validación de campos
  campos: boolean = false; // true == campos vacios // false == campos llenos

  constructor(
    private service: AlianzasBienestarService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.listarCategorias();
  }
  
  listarCategorias(){
    this.categoria = new CategoriaAlianzas();
    this.service.listarCategorias().subscribe(res =>{
      this.categorias = res;
    }, err =>{
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

  abrirModalAccion(accion: string, id: number) { // muestra el formulario de registro o modificacion de la alianza
    this.modalSwitch = true;
    if (accion == "guardar") {
      this.categoria = new CategoriaAlianzas();
      this.tituloModal = "Agregar alianza";
    } else if (accion == "actualizar") {
      this.tituloModal = "Editar alianza";

      this.categorias.forEach(item => {
        if (item.id == id) {
          this.categoria = item;
        }
      })
    }
    this.accion = accion;
  }

  confirmacion(accion: string, id: number) {
    this.accion = accion;
    this.modalSwitchConfirmacion = true;
    this.categorias.forEach(e => {
      if (e.id == id) {
        this.categoria = e;
      }
    })
    if (accion == 'eliminar') {
      this.mensajeModal = "¿Estás seguro que deseas eliminar la alianza?";
      this.textoBotonConfirmacion = "Si"
    }
    if (accion == 'cancelar') {
      this.mensajeModal = "¿Estás seguro que deseas cancelar?";
      this.textoBotonConfirmacion = "Si"
    }
  }

  confirmar() {
    let status;
    if (this.accion == 'eliminar') {
      this.service.eliminarCategoria(this.categoria).subscribe(res => {
        status = 200;
        console.log(res);
        this.alertaCategoria(this.accion, status)
      }, err => {
        status = 400;
        console.error(err);
      })
    }
    if (this.accion == 'cancelar') {
      this.recargar()
    }
  }

  alertaCategoria(accion, status) {
    let accionString = '';
    this.cerrarModal(0)
    if (status == 200) {
      accion == 'elimino' 
      this.mensajeModal = 'Se ' + accion + ' la alianza correctamente';
    } else {
      accion == 'eliminar'
      this.mensajeModal = 'Hubo un fallo al ' + accion + ' la alianza';
    }
    this.switchModalAlerta = true;
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
        this.categoria.imagen = prueba[1];
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

  anadirImagen(item) {
    let type = 'image/png';
    const byteCharacters = atob(item.imagen);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: type});
    const imageFile: File = new File([blob], item.nombre, {
      type: "image/png"
    });
    let generatedImage = window.URL.createObjectURL(imageFile);
    document.getElementById('imagen-'+item.id).setAttribute('src', generatedImage);
  }

  anadirImagenModal(item) {
    let type = 'image/png';
    const byteCharacters = atob(item.imagen);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: type});
    const imageFile: File = new File([blob], item.nombre, {
      type: "image/png"
    });
    let generatedImage = window.URL.createObjectURL(imageFile);
    document.getElementById('imagen-recuadro-excel').setAttribute('src', generatedImage);
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'nombre') document.getElementById('spanNombre').style.display = 'none';
    if (id == 'descripcion') document.getElementById('spanDescripcion').style.display = 'none';
  }

  cambiarEstado(event, id: number) {
    this.categorias.forEach(item => {
      if (item.id == id) {
        this.categoria = item;
        if (item.estado == 0) {
          item.estado = 1;
          this.categoria.estado = 1;
        } else {
          item.estado = 0;
          this.categoria.estado = 0;
        }
      }
    });
    this.service.cambiarEstadoCategoria(this.categoria.id,this.categoria.estado).subscribe(res=>{
        let label = this.categoria.estado > 0 ? "Habilitado" : "Inhabilitado";
        document.getElementById("slideEstado-" + id).innerText = label;
    }, err => console.error(err))
  }

  validarLongitud(event) {
    let input = event.target as HTMLInputElement;
    if (input.id == 'nombre') {
      if (input.value.length == 50) { document.getElementById('spanNombreC').style.display = 'block'; }
      else if (input.value.length < 50) { document.getElementById('spanNombreC').style.display = 'none' }
    }
    if(this.enviarPUSH == true){
      if (input.id == 'descripcion') {
        if (input.value.length == 150) { document.getElementById('spanDescripcionC').style.display = 'block'; }
        else if (input.value.length < 150) { document.getElementById('spanDescripcionC').style.display = 'none' }
      }
    }
  }

  cerrarModal(i) {
    if(i == 0){
      this.modalSwitchConfirmacion = false;
      this.modalSwitch = false;
      this.tituloModal = null;
      // aca la definicioón del objeto de la red social en null
      this.accion = null;
      this.categoria = new CategoriaAlianzas();
    }
    if(i == 1){
      this.switchModalAlerta = false;
      this.recargar();
    }
  }
  
  recargar(){ 
    this.router.navigateByUrl('seccionBienestar', { skipLocationChange: true }).then(() => this.router.navigate(['seccionBienestar/alianzas']));
  }

  guardarCambios(){
    let mensaje = "";
    this.campos = false;

    if (this.categoria.nombre == '' || this.categoria.nombre == null || this.categoria.nombre == undefined) {
      this.campos = true;
      document.getElementById('nombre').classList.add('campo-vacio');
      document.getElementById('spanNombre').style.display = 'block';
    }
    if (this.categoria.descripcion == '' || this.categoria.descripcion == null || this.categoria.descripcion == undefined) {
      this.campos = true;
      document.getElementById('descripcion').classList.add('campo-vacio');
      document.getElementById('spanDescripcion').style.display = 'block';
    }
    if (this.categoria.imagen == '' || this.categoria.imagen == null || this.categoria.imagen == undefined) {
      this.campos = true;
      document.getElementById('recuadro-excel').classList.add('campo-vacio');
      document.getElementById('spanImagen').style.display = 'block';
    }

    if (this.campos == false) {
      if (this.accion == "guardar") {
        this.categoria.estado = 1;
        this.categoria.id = null;
        this.categoria.creacion = null;
        this.categoria.modificacion = null;


        this.service.crearCategoria(this.categoria).subscribe(res => {
          this.alerta(res, this.accion, 200);
        }, err =>{
          this.alerta(err, this.accion, 400);
          console.error(err)
        })
      } else if (this.accion == "actualizar") {
        this.service.editarCategoria(this.categoria).subscribe(res => {
          this.alerta(res, this.accion, 200);
        }, err =>{
          this.alerta(err, this.accion, 400);
          console.error(err)
        })
      }
    }
  }

  alerta(res, accion, status) {
    let accionString = '';
    this.cerrarModal(0)
    if (status == '200') {
      accionString = accion == 'guardar' ? 'agregó' : 'edito'
      this.mensajeModal = 'Se ' + accionString + ' la alianza correctamente';
    } else {
      accionString = accion == 'guardar' ? 'agregar' : 'editar'
      this.mensajeModal = 'Hubo un fallo al ' + accionString + ' la alianza';
    }
    this.switchModalAlerta = true;
  }


}
