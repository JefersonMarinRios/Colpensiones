import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatPaginatorModule } from '@angular/material';
import { Router } from '@angular/router';
import { LineaAtencion } from '../modelo/linea-atencion';
import { LineaAtencionService } from '../servicios/linea-atencion.service';


@Component({
  selector: 'appcolp-lineas-atencion',
  templateUrl: './lineas-atencion.component.html',
  styleUrls: ['./lineas-atencion.component.css']
})
export class LineasAtencionComponent implements OnInit {

  lineaAtencion: LineaAtencion; // manejar solamente un elemento
  lineasAtencion: LineaAtencion[]; // arreglo de elementos
  mensajePrincipal: LineaAtencion; //  elemento con tipo == 2 y estado == 1
  modalSwitch: boolean = false;
  tituloModal: string = null;
  accion: string | null = null;

  switchModalAlerta: boolean = false;
  mensajeModal: String = "";

  modalAbierto: number = null;

  modalSwitchConfirmacion: boolean = false;

  camposVacios: any = [];
  mensajeConfirmacion: string = "";

  constructor(
    public service: LineaAtencionService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.listarLineas();
  }

  /*****************/
  listarLineas() {
    this.service.listarLineas().subscribe(res => {
      this.lineasAtencion = res;
      this.lineasAtencion.forEach(item => {
        if (item.tipo == 2 && item.estado == 1) {
          this.mensajePrincipal = item;
        }
      })
      var i = this.lineasAtencion.indexOf(this.mensajePrincipal);
      if (i !== -1) {
        this.lineasAtencion.splice(i, 1);
      }
    }, err => console.error(err));
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
  abrirModalAccion(tipo, accion, i) {
    this.modalSwitch = true;
    if (tipo == "superior") { this.tituloModal = accion + " mensaje superior"; }
    if (tipo == "linea") { this.tituloModal = accion + " línea de atención"; }
    if (accion == "Actualizar") {
      this.lineaAtencion = tipo == "superior" ? this.mensajePrincipal : this.lineasAtencion[i];
    } else if (accion == "Guardar") {
      this.lineaAtencion = new LineaAtencion();
      this.lineaAtencion = {
        estado: null,
        id: null,
        nombre: "",
        numero: "",
        tipo: 1
      };
    }
    // this.modalSwitch = true;
    this.accion = accion;
    this.modalSwitch = true;

    console.log(accion);
    console.log(this.lineaAtencion); 
  }


  /*****************/
  guardarCambios() {
    // debugger;
    this.camposVacios = false;
    if (this.lineaAtencion.nombre == '' || this.lineaAtencion.nombre == null || this.lineaAtencion.nombre == undefined) {
      this.camposVacios = true 
      document.getElementById('nombreLinea').classList.add('campo-vacio');
      document.getElementById('spanNombreLinea').style.display = 'block';
    }
    if ((this.lineaAtencion.numero == '' || this.lineaAtencion.numero == null || this.lineaAtencion.numero == undefined) && this.lineaAtencion.tipo == 1 ) {
      this.camposVacios = true 
      document.getElementById('numeroLinea').classList.add('campo-vacio');
      document.getElementById('spanNumeroLinea').style.display = 'block';
    }

    if (this.camposVacios == false) {
      if (this.accion == "Guardar") {
        this.lineaAtencion.id = null;
        this.lineaAtencion.estado = 1;
        this.lineaAtencion.tipo = 1;

        this.service.guardarCambios(this.accion.toString(), this.lineaAtencion).subscribe(res => {
          this.alerta(200, this.accion);
          console.log(res);
        }, err => {
          this.alerta(400, this.accion)
          console.log(err);
        })
      } else if (this.accion == "Actualizar") {
        this.service.guardarCambios(this.accion, this.lineaAtencion).subscribe(res => {
          this.alerta(200, this.accion)
          console.log(res);
        }, err => {
          this.alerta(400, this.accion)
          console.error(err)
        })
      }
    }
  }


  /*****************/
  validarLongitud(event) {
    let input = event.target as HTMLInputElement;
    if (input.id == 'nombreLinea') {

      
      if (input.value.length == 100) { document.getElementById('spanNombreC').style.display = 'block'; }
      else if (input.value.length < 100) { document.getElementById('spanNombreC').style.display = 'none' }
    }
    if (input.id == 'numeroLinea') {
      var code =  event.which || event.keyCode;
  
      let tecla = String.fromCharCode(code).toLowerCase()
      console.log(tecla)
      let letras = "áéíóúabcdefghijklmnñopqrstuvwxyz"
  
      if (letras.indexOf(tecla) != -1) {
        return false;
      }
      if (input.value.length == 100) { document.getElementById('spanNumeroLineaC').style.display = 'block'; }
      else if (input.value.length < 100) { document.getElementById('spanNumeroLineaC').style.display = 'none' }
    }
  }


  /*****************/
  removeClass(e) {
    e.target.classList.remove('campo-vacio');
    let id = e.target.id;
    if (id == 'nombreLinea') document.getElementById('spanNombreLinea').style.display = 'none';
    if (id == 'numeroLinea') document.getElementById('spanNumeroLinea').style.display = 'none';
  }


  /*****************/
  alerta(res, accion) {
    this.cerrarModal(0)
    if (res == '200') {
      if (this.lineaAtencion.tipo == 1) {
        this.mensajeModal = accion == "Guardar" ? 'Se ha creado una línea de atención correctamente' : 'Se ha actualizado la línea de atención correctamente';
      }
      if (this.lineaAtencion.tipo == 2) {
        this.mensajeModal = 'Se ha actualizado el mensaje superior correctamente';
      }
    } else if (res == '400') {
      if (this.lineaAtencion.tipo == 1) {
        this.mensajeModal = accion == "Guardar" ? 'Hubo un fallo al agregar la linea de atención' : 'Hubo un fallo al actuaizar la línea de atención';
      }
      if (this.lineaAtencion.tipo == 2) {
        this.mensajeModal = 'Se ha actualizado el mensaje superior correctamente';
      }
    }
    this.switchModalAlerta = true;
    this.listarLineas();
  }


  /*****************/
  cerrarModal(i) {
    if (i == 0) this.modalSwitch = false;
    if (i == 1) {
      this.switchModalAlerta = false;
      this.mensajeModal = '';
      this.router.navigateByUrl('contactanos/lineasAtencion', { skipLocationChange: true }).then(() => this.router.navigate(['contactanos/lineasAtencion']));
    }
  }


  eliminar(){
    this.service.eliminarLinea(this.lineaAtencion).subscribe(res=>{
      console.log(res);
      this.mensajeModal = "Se eliminó la linea de atención correctamente"
      this.switchModalAlerta = true;
      this.modalSwitchConfirmacion = false;  
      this.listarLineas();
    }, err =>{
      console.error(err)
      this.mensajeModal = "Ocurrio un fallo al eliminar la linea de atención"
      this.modalSwitchConfirmacion = false;  
      this.switchModalAlerta = true;
    })
    
  }
  
  confirmacionEliminar(tipo, id){
    if (tipo == "superior"){
      this.mensajeConfirmacion = "¿Está seguro de eliminar el mensaje superior?";
      this.lineaAtencion = this.mensajePrincipal;
    }
    if (tipo == "linea"){
      this.mensajeConfirmacion = "¿Está seguro de eliminar la linea de atención?";
      this.lineaAtencion = this.lineasAtencion.find(e => e.id == id);
    } 
    this.modalSwitchConfirmacion = true;  
  }

  cerrarModalConfirmacion(){
    this.modalSwitchConfirmacion = false;
    this.lineaAtencion = new LineaAtencion();
    this.lineaAtencion = {
      estado: null,
      id: null,
      nombre: "",
      numero: "",
      tipo: 1
    };
  }

}
