import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { CategoriaMasInformacion, SubCategoriaMasInfo } from '../modelo/mas-informacion'; 
import { MasInformacionService } from '../servicios/mas-informacion.service';
import { NotificacionService } from '../servicios/notificaciones.service';

@Component({
  selector: 'appcolp-mas-informacion',
  templateUrl: './mas-informacion.component.html',
  styleUrls: ['./mas-informacion.component.css']
})

export class MasInformacionComponent implements OnInit {

  listaCategorias: CategoriaMasInformacion[] = null;
  categoria: CategoriaMasInformacion = null;

  // File
  file: File | null = null;
  
  modalSwitchConfirmacion: boolean = false;
  modalAbierto: number = null;// Modal
  modalSwitch: boolean = false;
  tituloModal: string = null;
  accion: string = "";
  switchModalAlerta: boolean = false;
  mensajeModal: String = "";


  validacionFechas: boolean = true;
  imagenBoton: string = 'check-off-gris';
  enviarPUSH: boolean = false;
  fechasInferior: boolean = false;

  contenidoPush: any = null;
  fechaInicio: any = null;
  fechaFin: any = null;
  presentacion: string | null = null

  campos: boolean = false;

  constructor(
    public service: MasInformacionService,
    public servicePush: NotificacionService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.listarCategorias();
  }
  
  listarCategorias(){
    this.service.listarCategorias().subscribe(res=>{
      this.listaCategorias = res;
      console.log(this.listaCategorias)
    }, err =>{
      console.error(err)
    });
  }

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

  confirmacionEliminar(id: number) {
    this.modalSwitchConfirmacion = true;
    this.listaCategorias.forEach(item => {
      if (item.id == id) {
        this.categoria = item;
      }
    })
    this.abrirModal(this.categoria.id)
  }

  abrirModalAccion(accion, id) {
    this.modalSwitch = true;
    if (accion == "guardar") {
      this.categoria = new CategoriaMasInformacion();
      this.categoria.id = null
      this.categoria.estado = 1;
      this.categoria.tipo = 1;
      this.tituloModal = "Crear categoría";
    } else if (accion == "actualizar") {
      this.tituloModal = "Actualizar categoría";

      this.listaCategorias.forEach(item => {
        if (item.id == id) {
          this.categoria = item;
        }
      })
    }
    this.accion = accion;
  }

  cambiarEstado(event, id: number) {
    this.listaCategorias.forEach(item => {
      if (item.id == id) {
        this.categoria = item;
        if (item.estado == 0) {
          item.estado = 1;
          this.categoria.estado = 1;
          let contenedor = document.getElementById('contenedor-' +id) as HTMLElement;
          contenedor.style.backgroundColor='white'
        } else {
          item.estado = 0;
          this.categoria.estado = 0;
          let contenedor = document.getElementById('contenedor-' +id) as HTMLElement;
          contenedor.style.backgroundColor='rgb(0 0 0 / 20%)'
        }
      }
    });

    this.service.estadoCategoria(this.categoria).subscribe(res => {
      let label = this.categoria.estado > 0 ? "Habilitado" : "Inhabilitado";
      document.getElementById("slideEstado-" + id).innerText = label;
    }, err => console.error(err))
  }

  eliminar() {
    this.abrirModal(this.categoria.id);
    this.service.eliminarCategoria(this.categoria).subscribe(res => {
      let mensaje = "Contenido eliminado exitosamente";
      this.cerrarModalConfirmacion();
      this.eliminarConfirma(mensaje, "eliminar");
    }, err => console.error(err))
  }

  cerrarModalConfirmacion() {
    this.modalSwitchConfirmacion = false;
    this.categoria = new CategoriaMasInformacion();
  }

  eliminarConfirma(message: string, action: string) {
    this.modalSwitchConfirmacion = false;
    this.switchModalAlerta = true;
    this.mensajeModal = message;
    this.listarCategorias();
  }

  cerrarModal(i) {
    if (i == 0) this.modalSwitch = false;
    if (i == 1) {
      this.switchModalAlerta = false;
      this.mensajeModal = '';
      this.router.navigateByUrl('contactanos', { skipLocationChange: true }).then(() => this.router.navigate(['masInformacion']));
    }
  }

  abrirCarga() {
    document.getElementById("cargaImagen").click();
  }

  addFile(files) {
    this.file = files.item(0);
    if (this.file != null) {
      this.getBase64(this.file).then(data => {
        console.log(data)
        let prueba = data.toString().split(',');
        this.categoria.imagen = prueba[1];
        console.log(this.categoria.imagen);
      }, err =>{
        console.error(err)
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
        console.log(data);
        let imagen = (document.getElementById('imagen-recuadro-excel') as HTMLImageElement);
        imagen.src = reader.result.toString();
        resolve(data);
      }
      reader.onerror = error => reject(error);
    })
  }

  anadirImagen(item: CategoriaMasInformacion) {
    let type = 'image/png';
    const byteCharacters = atob(item.imagen);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: type });
    const imageFile: File = new File([blob], item.nombre, {
      // type: "image/png"
      type: type
    });
    let generatedImage = window.URL.createObjectURL(imageFile);
    document.getElementById('imagen-' + item.id).setAttribute('src', generatedImage);
    if(item.estado == 0) (document.getElementById("contenedor-" + item.id) as HTMLElement).style.backgroundColor = 'rgb(0 0 0 / 20%)'
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'nombre') document.getElementById('spanNombre').style.display = 'none';

  }

  validarLongitud(event) {
    let input = event.target as HTMLInputElement;
    if (input.id == 'nombre') {
      if (input.value.length == 50) { document.getElementById('spanNombreC').style.display = 'block'; }
      else if (input.value.length < 50) { document.getElementById('spanNombreC').style.display = 'none' }
    }
  }

  cambiarTipo($event){
    this.categoria.tipo = parseInt($event.value)
    // Codigo para mostrar imagen
  }

  togglePUSH(e) {
    this.enviarPUSH = this.enviarPUSH == false ? true : false;
    if (this.enviarPUSH == true) {
      this.imagenBoton = 'check-on-azul';
      e.target.classList.remove('gris');
      e.target.classList.add('azul');
      document.getElementById('checkPush').classList.remove('gris');
      document.getElementById('checkPush').classList.add('azul');
    } else if (this.enviarPUSH == false) {
      this.imagenBoton = 'check-off-gris'
      e.target.classList.remove('azul');
      e.target.classList.add('gris');
      document.getElementById('checkPush').classList.remove('azul');
      document.getElementById('checkPush').classList.add('gris');
    }
  }

  guardarCambios(){
    this.campos = false;

    if (this.categoria.nombre == '' || this.categoria.nombre == null || this.categoria.nombre == undefined) {
      this.campos = true;
      document.getElementById('nombre').classList.add('campo-vacio');
      document.getElementById('spanNombre').style.display = 'block';
    }
    if (this.categoria.imagen == '' || this.categoria.imagen == null || this.categoria.imagen == undefined) {
      this.campos = true;
      document.getElementById('recuadro-excel').classList.add('campo-vacio');
      document.getElementById('spanImagen').style.display = 'block';
    }


    if(this.campos == false){
      if(this.accion == "guardar"){
        this.service.guardarCategoria(this.categoria).subscribe(res=>{
          let mensaje = 'Su contenido se ha guardado exitosamente'
          if(this.enviarPUSH) this.enviarPush()
          else this.eliminarConfirma(mensaje, "guardar");
          console.log(res)
        }, err =>{
          let mensaje = 'Ocurrio un fallo con su solicitud'
          this.eliminarConfirma(mensaje, "guardar");
          console.error(err)
        })
      }else if(this.accion == "actualizar"){
        this.service.actualizarCategoria(this.categoria).subscribe(res=>{
          let mensaje = 'Su contenido se ha guardado exitosamente'
          if(this.enviarPUSH) this.enviarPush()
          else this.eliminarConfirma(mensaje, "guardar");
          console.log(res)
        }, err =>{
          let mensaje = 'Ocurrio un fallo con su solicitud'
          this.eliminarConfirma(mensaje, "guardar");
          console.error(err)
        });
      }
    }

  }

  enviarPush(){
    let tituloMensajePush = '';
    if (this.accion == 'guardar') tituloMensajePush = "Sección Bienestar: Se agrego un nuevo boletín"
    if (this.accion == 'actualizar') tituloMensajePush = "Sección Bienestar: Se modifico un boletín"
    let envio = {
      "titulo": tituloMensajePush,
      "subtitulo": this.contenidoPush,
      "fecha_inicio": this.fechaInicio,
      "fecha_final": this.fechaFin,
      "tipo": 1,
      "url": '',
    }
    this.servicePush.guardar(envio).subscribe(res =>{
      let mensaje = 'Su contenido se ha guardado exitosamente'
      this.eliminarConfirma(mensaje, "guardar");
      console.log(res)
    }, err =>{
      let mensaje = 'Su contenido se ha guardado exitosamente pero ocurrio un fallo al enviar la notificación!'
      this.eliminarConfirma(mensaje, "guardar");
      console.error(err)
    })
  }


}
