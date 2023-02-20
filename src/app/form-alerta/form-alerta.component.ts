import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginatorModule, MatSnackBar, TransitionCheckState } from '@angular/material';
import { Router } from '@angular/router';
import { Mensaje } from '../modelo/mensaje';
import { MensajeService } from '../servicios/mensaje-indisponibilidad.service';

@Component({
  selector: 'appcolp-form-alerta',
  templateUrl: './form-alerta.component.html',
  styleUrls: ['./form-alerta.component.css']
})
export class FormAlertaComponent implements OnInit {

  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  mensaje: Mensaje;
  switchModalAlerta: boolean = false;
  mensajeModal: any = null;
  campos: any = [];

  constructor(
    private mensajeService: MensajeService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    mensajeService.listarTodo(1).subscribe(res => {
      this.mensaje = new Mensaje();
      let {id, titulo, mensaje} = res;
      this.mensaje = {
        "mensaje": mensaje,
        "id": id,
        "titulo": titulo
      }
    })
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
  
  cancelar(){
    this.mensajeService.listarTodo(1).subscribe(res => {
      this.mensaje = new Mensaje();
      let {id, titulo, mensaje} = res;
      this.mensaje = {
        "mensaje": mensaje,
        "id": id,
        "titulo": titulo
      }
    })
  }

  envioFormulario(){
    let mensaje = ""
    if(this.campos.length != 0){
      mensaje = `
      Los campos no cumplen las condiciones para el envio del formulario.
      `;
      this.alerta(mensaje, 'ERROR');
    }else if(this.campos.length == 0){
      if(
        this.mensaje.titulo == "" || 
        this.mensaje.titulo == null || 
        this.mensaje.mensaje == "" || 
        this.mensaje.mensaje == null
      ){
        mensaje = "Los campos deben ser diligenciados";
        this.alerta(mensaje, 'ERROR');
      }else{
        this.mensajeService.agregarActualizar(1,this.mensaje).subscribe(res =>{
          mensaje = "El mensaje de alerta se ha guardado exitosamente"
          this.alerta(mensaje, 'OK');
        }, error =>{ 
          mensaje = "Ocurrio un fallo en su solicitud";
          this.alerta(mensaje, 'ERROR');
          console.error(error)
        });
      }
    }
  }

  cerrarModal(i) {
    if (i == 1) this.switchModalAlerta = false; this.mensajeModal = '';
  }

  alerta(res, accion) {
    this.mensajeModal = res;
    this.switchModalAlerta = true;
  }

  validarLongitud($event){
    let input = $event.target;
    let id = input.id;
    let value: string = input.value;
    if(id == 'inputTitulo'){
      this.validar(value.length, 50, id);
    }
    if(id == 'inputMensaje'){
      this.validar(value.length, 500, id);
    }
  }

  
  validar(valor, tamanoMaximo, id){
    let mensaje = '';
    let posicion = null;
    if(valor < tamanoMaximo){
      if(id == 'inputTitulo') document.getElementById('spanTitulo').style.display = 'none';
      if(id == 'inputMensaje') document.getElementById('spanMensaje').style.display = 'none';
      if(this.campos.includes(id)){
        posicion = this.campos.indexOf(id);
        if(posicion !== -1){
          this.campos.splice(posicion, 1)
        }
      }
    }
    if(valor == 0){
      mensaje = 'El campo es requerido'
      if(id == 'inputTitulo'){
        document.getElementById('spanTitulo').style.display = 'block';
        document.getElementById('spanTitulo').innerText = mensaje;
      } 
      if(id == 'inputMensaje'){
        document.getElementById('spanMensaje').style.display = 'block';
        document.getElementById('spanMensaje').innerText = mensaje;
      }
      if(this.campos.includes(id)){}else{this.campos.push(id)}
    }
    if(valor >= tamanoMaximo){
      mensaje = 'El campo exedio el limite de caracteres. (Max. ' + tamanoMaximo + ')'
      if(id == 'inputTitulo'){
        document.getElementById('spanTitulo').style.display = 'block';
        document.getElementById('spanTitulo').innerText = mensaje;
      } 
      if(id == 'inputMensaje'){
        document.getElementById('spanMensaje').style.display = 'block';
        document.getElementById('spanMensaje').innerText = mensaje;
      }
      if(this.campos.includes(id)){}else{
        if(valor > tamanoMaximo) this.campos.push(id)
      }
    }
  }
}
