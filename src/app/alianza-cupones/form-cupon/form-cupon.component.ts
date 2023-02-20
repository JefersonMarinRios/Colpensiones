import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { id } from '@swimlane/ngx-charts';
import { CuponAlianzas, ID } from 'src/app/modelo/cupon-alianzas';
import { AlianzasBienestarService } from 'src/app/servicios/alianzas-bienestar.service';
import { NotificacionService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'appcolp-form-cupon',
  templateUrl: './form-cupon.component.html',
  styleUrls: ['./form-cupon.component.css']
})

export class FormCuponComponent implements OnInit {

  @Input() cupon: CuponAlianzas | null;
  @Input() idAlianza: number;
  accion: string | null = null

  camposVacios: any = [];
  mensajeModal: String = ""; // mensaje modal alerta
  modalSwitch: boolean = false;
  contenidoPush: any = null;
  fechaInicio: any = null;
  fechaFin: any = null;

  validacionFechas: boolean = true;
  imagenBoton: string = 'check-off-gris';
  enviarPUSH: boolean = false;
  cuponSave: CuponAlianzas | null;

  fechasInferior: boolean = false;

  // File
  file: File | null = null;

  constructor(
    private service: AlianzasBienestarService,
    public servicePush: NotificacionService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    if (this.cupon == null) {
      this.cupon = new CuponAlianzas();
      this.cupon.id = null;
      this.cupon.estado = 1;
      this.accion = 'guardar'
    } else {
      this.cupon = this.cupon;
      this.accion = 'editar'
    }
    this.cupon.categoria = new ID();
    this.cupon.categoria.id = this.idAlianza;
    this.mensajeModal = ""; // mensaje modal alerta
    this.modalSwitch = false;
    this.contenidoPush = null;
    this.fechaInicio = null;
    this.fechaFin = null;
    this.validacionFechas = true;
    this.imagenBoton = 'check-off-gris';
    this.enviarPUSH = false;
  }

  recargar() {
    this.router.navigate(['/alianza'], { queryParams: { opc: this.idAlianza } });
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

  validarLongitud(event) {
    let input = event.target as HTMLInputElement;
    if (input.id == 'inputTitulo') {
      if (input.value.length == 50) { document.getElementById('spanTituloC').style.display = 'block'; }
      else if (input.value.length < 50) { document.getElementById('spanTituloC').style.display = 'none' }
    }
    if(this.enviarPUSH == true){
      if (input.id == 'inputPush') {
        if (input.value.length == 150) { document.getElementById('spanInputPushC').style.display = 'block'; }
        else if (input.value.length < 150) { document.getElementById('spanInputPushC').style.display = 'none' }
      }
    }
  }

  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'inputTitulo') document.getElementById('spanTitulo').style.display = 'none';
    if (id == 'inputPush') document.getElementById('spanInputPush').style.display = 'none';
    if (id == 'fechaInicial') document.getElementById('spanFechaInicial').style.display = 'none';
    if (id == 'fechaFin') document.getElementById('spanFechaFin').style.display = 'none';
  }

  camposObligatorios() {
    if (this.camposVacios.includes('inputTitulo')) {
      document.getElementById('inputTitulo').classList.add('campo-vacio');
      document.getElementById('spanTitulo').style.display = 'block';
    }
    if (this.camposVacios.includes('imagenFrontal')) {
      document.getElementById('recuadro-frontal').classList.add('campo-vacio');
      document.getElementById('spanImagenFrontal').style.display = 'block';
    }
    if (this.camposVacios.includes('imagenPosterior')) {
      document.getElementById('recuadro-posterior').classList.add('campo-vacio');
      document.getElementById('spanImagenPosterior').style.display = 'block';
    }

    if(this.enviarPUSH == true){

      if (this.camposVacios.includes('inputPush')) {
        document.getElementById('inputPush').classList.add('campo-vacio');
        document.getElementById('spanInputPush').style.display = 'block';
      }
      if (this.camposVacios.includes('fechaInicial')) {
        document.getElementById('fechaInicial').classList.add('campo-vacio');
        document.getElementById('spanFechaInicial').style.display = 'block';
      }
      if (this.camposVacios.includes('fechaFin')) {
        document.getElementById('fechaFin').classList.add('campo-vacio');
        document.getElementById('spanFechaFin').style.display = 'block';
      }
    }

  }

  guardarCambios() {
    debugger
    this.camposVacios = [];
    
    if (this.cupon.titulo == null || this.cupon.titulo == '' || this.cupon.titulo == undefined) this.camposVacios.push('inputTitulo');
    if (this.cupon.imagenFrontal == null || this.cupon.imagenFrontal == '' || this.cupon.imagenFrontal == undefined) this.camposVacios.push('imagenFrontal');
    if (this.cupon.imagenPosterior == null || this.cupon.imagenPosterior == '' || this.cupon.imagenPosterior == undefined) this.camposVacios.push('imagenPosterior');

    if(this.enviarPUSH == true){
      if (this.contenidoPush == null || this.contenidoPush == '' || this.contenidoPush == undefined) this.camposVacios.push('inputPush');
      if (this.fechaInicio == null || this.fechaInicio == '' || this.fechaInicio == undefined) this.camposVacios.push('fechaInicial');
      if (this.fechaFin == null || this.fechaFin == '' || this.fechaFin == undefined) this.camposVacios.push('fechaFin');
    }

    if (this.camposVacios.length > 0) {
      this.camposObligatorios();
    } this.validacionFechas = true;
    if (this.enviarPUSH == true) {
      this.convertirFechas();
    }
    if (this.validacionFechas == true) {      
      this.service.guardarCupon(this.cupon, this.accion).subscribe(res => {
        console.log(res);
        if (this.enviarPUSH == true) {
          let tituloMensajePush = '';
          if (this.cupon.id == null) tituloMensajePush = "Sección Bienestar: Se agrego la alianza"
          if (this.cupon.id != null) tituloMensajePush = "Sección Bienestar: Se modifico la alianza"
          let envio = {
            "titulo": tituloMensajePush,
            "subtitulo": this.contenidoPush,
            "fecha_inicio": this.fechaInicio,
            "fecha_final": this.fechaFin,
            "tipo": 1,
            "url": '',
          }
          this.servicePush.guardar(envio).subscribe(res => {
            let mensaje = '';
            if (this.cupon.id == null) mensaje = "Se creo la alianza correctamente"
            if (this.cupon.id != null) mensaje = "Se modifico la alianza correctamente"
            this.alerta(mensaje);
          }, err => {
            console.log(err);
            let mensaje = '';
            if (this.cupon.id == null) mensaje = "Se creo la alianza correctamente, pero hubo un fallo enviando la notificación push"
            if (this.cupon.id != null) mensaje = "Se modifico la alianza correctamente, pero hubo un fallo enviando la notificación push"
            this.alerta(mensaje);
          })
        } else {
          let mensaje = "";
          if (this.cupon.id == null) mensaje = "Se creo la alianza correctamente"
          if (this.cupon.id != null) mensaje = "Se modifico la alianza correctamente"
          this.alerta(mensaje);
        }
      }, err => {
        let mensaje = '';
        console.error(err)
        mensaje = "Ocurrio un fallo en la solicitud"
        this.alerta(mensaje);
      })
    } else {
      let mensaje = `Rango de fechas no permitido.\n
      Tenga en cuenta las siguientes recomendaciones:\n
      1. La fecha inicial <b>No</b> puede ser menor a la fecha actual.
      2. La fecha final <b>debe</b> ser mayor a la fecha actual.
      3. la fecha inicial <b>No</b> puede ser mayor a la fecha final
      `;
      this.alerta(mensaje);
    }
  }

  convertirFechas() {
    // sacar fecha en un objeto tipo Date()
    let fechaActual = new Date();
    let diaActual = fechaActual.getDate() < 9 ? '0' + fechaActual.getDate() : fechaActual.getDate();
    let mesActual = fechaActual.getMonth() < 9 ? '0' + (fechaActual.getMonth() + 1) : fechaActual.getMonth() + 1;
    let fechaActualString = fechaActual.getFullYear().toString() + '/' + mesActual.toString() + '/' + diaActual.toString();
    fechaActual = new Date(fechaActualString)
    let fechaUno = new Date((document.getElementById('fechaInicial') as HTMLInputElement).value);
    let fechaDos = new Date((document.getElementById('fechaFin') as HTMLInputElement).value);

    // if(fechaUno <= fechaActual || fechaDos <= fechaActual){
    if (
      (fechaActual > fechaUno || fechaActual >= fechaDos) ||
      (fechaUno >= fechaDos)
    ) {
      this.validacionFechas = false;
    } else {
      this.fechasInferior = true;

      // Sacar el dia
      let diaUno = fechaUno.getDate() < 9 ? '0' + fechaUno.getDate() : fechaUno.getDate();
      let diaDos = fechaDos.getDate() < 9 ? '0' + fechaDos.getDate() : fechaDos.getDate();
      // Sacar el mes
      let mesUno = fechaUno.getMonth() < 9 ? '0' + (fechaUno.getMonth() + 1) : fechaUno.getMonth() + 1;
      let mesDos = fechaDos.getMonth() < 9 ? '0' + (fechaDos.getMonth() + 1) : fechaDos.getMonth() + 1;

      this.fechaInicio = fechaUno.getFullYear().toString() + '-' + mesUno.toString() + '-' + diaUno.toString();
      this.fechaFin = fechaDos.getFullYear().toString() + '-' + mesDos.toString() + '-' + diaDos.toString();
    }
  }

  cancelar(){ 
    this.router.navigateByUrl('seccionBienestar', { skipLocationChange: true }).then(() => this.router.navigate(['seccionBienestar/alianzas']));
  }

  // cancelar() {
  //   if (this.accion == 'guardar') {
  //     this.cupon = new CuponAlianzas();
  //   } else {
  //     this.cupon = this.cupon;
  //   }
  //   this.mensajeModal = ""; // mensaje modal alerta
  //   this.modalSwitch = false;
  //   this.contenidoPush = null;
  //   this.fechaInicio = null;
  //   this.fechaFin = null;
  //   this.validacionFechas = true;
  //   this.imagenBoton = 'check-off-gris';
  //   this.enviarPUSH = false;
  // }

  alerta(message: string) {
    this.modalSwitch = true;
    this.mensajeModal = message;
  }

  cerrarModal() {
    location.reload();
          
  }

  abrirCarga(i) {
    if (i == 1) document.getElementById("cargaImagenFrontal").click();
    if (i == 2) document.getElementById("cargaImagenPosterior").click();
  }

  addFile(e) {
    let input = e.target as HTMLInputElement;
    let files = input.files
    let idInput = input.id;

    this.file = files.item(0);
    if (this.file != null) {
      this.getBase64(this.file, idInput).then(data => {
        // console.log(data);
        let prueba = data.toString().split(',');
        if (idInput == 'cargaImagenFrontal') {
          this.cupon.imagenFrontal = prueba[1];
          document.getElementById('recuadro-frontal').classList.remove('campo-vacio');
          document.getElementById('spanImagenFrontal').style.display = 'none';
        }
        if (idInput == 'cargaImagenPosterior') {
          this.cupon.imagenPosterior = prueba[1];
          document.getElementById('recuadro-posterior').classList.remove('campo-vacio');
          document.getElementById('spanImagenPosterior').style.display = 'none';
        }
      });
    }
  }

  getBase64(file, idInput) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let data = reader.result;
        let imagen = (document.getElementById(idInput) as HTMLImageElement);
        imagen.src = reader.result.toString();
        resolve(data);
      }
      reader.onerror = error => reject(error);
    })
  }

  anadirImagen(item: CuponAlianzas) {
    let imagenFrontal;
    let imagenPosterior;
    if (item.imagenFrontal != '' && item.imagenFrontal != null) {
      let type = 'image/png';
      const byteCharacters = atob(item.imagenFrontal);
      let nombre = '-frontal'
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: type });
      const imageFile: File = new File([blob], item.titulo + nombre, {
        type: "image/png"
      });
      imagenFrontal = window.URL.createObjectURL(imageFile);
    } else {
      imagenFrontal = '../assets/images/image-gallery.svg';
    }
    if (item.imagenPosterior != '' && item.imagenPosterior != null) {
      let type = 'image/png';
      const byteCharacters = atob(item.imagenPosterior);
      let nombre = '-posterior'
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: type });
      const imageFile: File = new File([blob], item.titulo + nombre, {
        type: "image/png"
      });
      imagenPosterior = window.URL.createObjectURL(imageFile);
    } else {
      imagenPosterior = '../assets/images/image-gallery.svg';
    }
    // document.getElementById('imagenFrontal').setAttribute('src', imagenFrontal);
    // document.getElementById('imagenPosterior').setAttribute('src', imagenPosterior);
  }

}
