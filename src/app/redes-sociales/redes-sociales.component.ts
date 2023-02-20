import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RedSocial } from '../modelo/red-social';
import { RedSocialService } from '../servicios/redes-sociales.service';


@Component({
  selector: 'appcolp-redes-sociales',
  templateUrl: './redes-sociales.component.html',
  styleUrls: ['./redes-sociales.component.css']
})
export class RedesSocialesComponent implements OnInit {

  redSocial: RedSocial; // manejar solamente un elemento
  redesSociales: RedSocial[]; // arreglo de elementos
  activas: RedSocial[]; // arreglo de elementos con estado == 1
  inactivas: RedSocial[]; // arreglo de elementos con estado == 0
  modalAbierto: number = null;
  // Modal
  modalSwitch: boolean = false;
  modalSwitchConfirmacion: boolean = false;
  tituloModal: string = null;
  accion: string = "";
  switchModalAlerta: boolean = false;
  mensajeModal: String = "";
  

  // File
  file: File | null = null;

  // Validación de campos
  campos: boolean = false; // true == campos vacios // false == campos llenos

  validURL: boolean = false;

  constructor(
    public service: RedSocialService,
    private router: Router,
  ) {
    this.service.listarRedes().subscribe(res => {
      this.redesSociales = res;
    });
  }

  ngOnInit() {
    this.listarRedes();
  }

  /*****************/
  listarRedes() {
    this.service.listarRedes().subscribe(res => {
      this.redesSociales = res;
      console.log(this.redesSociales);
    });
  }

  /*****************/
  abrirModal(i) {
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

  /*****************/
  abrirModalAccion(accion, id) {
    this.modalSwitch = true;
    if (accion == "guardar") {
      this.redSocial = new RedSocial();
      this.tituloModal = "Crear vínculo";
    } else if (accion == "actualizar") {
      this.tituloModal = "Actualizar vínculo";

      this.redesSociales.forEach(item => {
        if (item.id == id) {
          this.redSocial = item;
        }
      })
    }
    this.accion = accion;
  }

  /*****************/
  guardarCambios() {
    let mensaje = "";
    this.campos = false;

    if (this.redSocial.nombre == '' || this.redSocial.nombre == null || this.redSocial.nombre == undefined) {
      this.campos = true;
      document.getElementById('nombre').classList.add('campo-vacio');
      document.getElementById('spanNombre').style.display = 'block';
    }
    if (this.redSocial.url == '' || this.redSocial.url == null || this.redSocial.url == undefined) {
      this.campos = true;
      document.getElementById('url').classList.add('campo-vacio');
      document.getElementById('spanURL').style.display = 'block';
    }
    // if(this.validateURL(this.redSocial.url)){
    //   this.validURL == true
    // }else{
    //   this.validURL == false
    // }
    if (this.redSocial.imagen == '' || this.redSocial.imagen == null || this.redSocial.imagen == undefined) {
      this.campos = true;
      document.getElementById('recuadro-excel').classList.add('campo-vacio');
      document.getElementById('spanImagen').style.display = 'block';
    }

    

    if (this.campos == false) {
      if(this.validateURL(this.redSocial.url)){
        if (this.accion == "guardar") {
          this.redSocial.estado = 1;
          this.redSocial.id = null;
  
          this.service.agregar(this.redSocial).subscribe(res => {
            this.alerta(200, this.accion)
          }, err => {
            console.error(err);
            this.alerta(400, this.accion)
          })
        } else if (this.accion == "actualizar") {
          this.service.editar(this.redSocial).subscribe(res => {
            this.alerta(200, this.accion)
          }, err => {
            console.error(err)
            this.alerta(400, this.accion)
          })
        }
      }else{
        this.mensajeModal = 'La URL no es valida';
        this.switchModalAlerta = true;
      }
    }else{
      this.mensajeModal = 'Todo el formulario debe ser diligenciado';
      this.switchModalAlerta = true;
    }
  }

  /*****************/
  alerta(res, accion) {
    let accionString = '';
    this.cerrarModal(0)
    if (res == '200') {
      accionString = accion == 'guardar' ? 'agregó' : 'actualizó'
      this.mensajeModal = 'Se ' + accionString + ' correctamente la red social';

    } else {
      accionString = accion == 'guardar' ? 'agregar' : 'actualizar'
      this.mensajeModal = 'Hubo un fallo al ' + accionString + ' la red social';
    }
    this.switchModalAlerta = true;
    this.listarRedes();
  }

  /*****************/
  eliminarConfirma(message: string, action: string) {
    this.switchModalAlerta = true;
    this.mensajeModal = message;
    this.listarRedes();
  }

  /*****************/
  eliminar() {
    this.abrirModal(this.redSocial.id);

    this.service.eliminar(this.redSocial).subscribe(res => {
      let mensaje = "La red social se ha eliminado exitosamente";
      this.cerrarModalConfirmacion();
      this.eliminarConfirma(mensaje, "eliminar");
    }, err => console.error(err))
  }

  /*****************/
  cerrarModal(i) {
    if (i == 0) this.modalSwitch = false;
    if (i == 1) {
      this.switchModalAlerta = false;
      this.mensajeModal = '';
      this.router.navigateByUrl('contactanos', { skipLocationChange: true }).then(() => this.router.navigate(['contactanos/redesSociales']));
    }
  }

  /*****************/
  confirmacionEliminar(id: number) {
    this.modalSwitchConfirmacion = true;
    this.redesSociales.forEach(item => {
      if (item.id == id) {
        this.redSocial = item;
      }
    })
    this.abrirModal(this.redSocial.id)
  }

  /*****************/
  cerrarModalConfirmacion() {
    this.modalSwitchConfirmacion = false;
    this.redSocial = new RedSocial();
  }

  /*****************/
  cambiarEstado(event, id: number) {
    this.redesSociales.forEach(item => {
      if (item.id == id) {
        this.redSocial = item;
        if (item.estado == 0) {
          item.estado = 1;
          this.redSocial.estado = 1;
          let contenedor = document.getElementById('contenedor-' +id) as HTMLElement;
          contenedor.style.backgroundColor='white'
        } else {
          item.estado = 0;
          this.redSocial.estado = 0;
          let contenedor = document.getElementById('contenedor-' +id) as HTMLElement;
          contenedor.style.backgroundColor='rgb(0 0 0 / 20%)'
        }
      }
    });

    this.service.editar(this.redSocial).subscribe(res => {
      let label = this.redSocial.estado > 0 ? "Habilitado" : "Inhabilitado";
      document.getElementById("slideEstado-" + id).innerText = label;
    }, err => console.error(err))
  }

  /*****************/
  abrirCarga() {
    document.getElementById("cargaImagen").click();
  }

  /*****************/
  addFile(files) {
    this.file = files.item(0);
    if (this.file != null) {
      this.getBase64(this.file).then(data => {
        let prueba = data.toString().split(',');
        this.redSocial.imagen = prueba[1];
      }, err =>{
        console.error(err)
      });
    }
    document.getElementById('recuadro-excel').classList.remove('campo-vacio');
    document.getElementById('spanImagen').style.display = 'none';
  }

  /*****************/
  validarLongitud(event) {
    let input = event.target as HTMLInputElement;
    if (input.id == 'nombre') {
      if (input.value.length == 500) { document.getElementById('spanNombreC').style.display = 'block'; }
      else if (input.value.length < 500) { document.getElementById('spanNombreC').style.display = 'none' }
    }
    if (input.id == 'url') {
      if(this.validateURL(input.value)){
        document.getElementById('url').classList.remove('campo-vacio');
        document.getElementById('spanURLValid').style.display = 'none';
        this.validURL = true;
        if (input.value.length == 1000) { document.getElementById('spanURLC').style.display = 'block'; }
        else if (input.value.length < 1000) { document.getElementById('spanURLC').style.display = 'none' }
      }else{
        document.getElementById('url').classList.add('campo-vacio');
        document.getElementById('spanURLValid').style.display = 'block'
        this.validURL = false;
      }
    }
    if (input.id == 'descripcion') {
      if (input.value.length == 200) { document.getElementById('spanDescripcionC').style.display = 'block'; }
      else if (input.value.length < 200) { document.getElementById('spanDescripcionC').style.display = 'none' }
    }
  }

  validateURL(textval) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
  }

  /*****************/
  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'nombre') document.getElementById('spanNombre').style.display = 'none';
    if (id == 'url') document.getElementById('spanURL').style.display = 'none';
  }

  /*****************/
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

  /*****************/
  anadirImagen(item) {
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
    document.getElementById('imagen-' + item.id).setAttribute('src', generatedImage);
    if(item.estado == 0) (document.getElementById("contenedor-" + item.id) as HTMLElement).style.backgroundColor = 'rgb(0 0 0 / 20%)'
  }

}
