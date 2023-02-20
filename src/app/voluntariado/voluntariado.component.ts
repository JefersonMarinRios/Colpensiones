import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatPaginatorModule } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Voluntariado } from '../modelo/voluntariado';
import { VoluntariadoService } from '../servicios/voluntariado.service';
import * as XLSX from 'xlsx';
import { NotificacionService } from '../servicios/notificaciones.service';

@Component({
  selector: 'appcolp-voluntariado',
  templateUrl: './voluntariado.component.html',
  styleUrls: ['./voluntariado.component.css']
})
export class VoluntariadoComponent implements OnInit {
  

  enviarPUSH: boolean = false;
  voluntariado: Voluntariado;
  voluntariados: Voluntariado[];
  voluntariadoSave: Voluntariado;
  modalSwitch: boolean = false;
  contenidoPush: any;
  fechaInicio: any;
  fechaFin: any;
  presentacion: string | null = null

  validacionFechas: boolean = true;
  imagenBoton: string = 'check-off-gris';
  mensajeModal: string = '';
  modalSwitchConfirmacion: boolean = false; // interruptor para mostrar modal confirmación
  textoBotonConfirmacion: string | null = null;
  accion: string | null = null; // identificar la accion realizada 
  switchModalAlerta: boolean = false; // interruptor modal alerta

  constructor(
    public service: VoluntariadoService,
    public servicePush: NotificacionService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  atras() {
    this.router.navigateByUrl('seccionBienestar', { skipLocationChange: true }).then(() => this.router.navigate(['seccionBienestar']));
  }

  ngOnInit() {
    this.listarVoluntariado();
    // this.resetTimer();
  }

  listarVoluntariado() {
    this.service.listarTodo().subscribe(res => {
      this.voluntariados = res;
      let { descripcion, estado, id } = res[0]
      this.voluntariado = {
        descripcion: descripcion,
        estado: estado,
        id: id,
        fechaCreacion: null
      }
      this.voluntariadoSave = {
        descripcion: descripcion,
        estado: estado,
        id: id,
        fechaCreacion: null
      }
    })
  }

  togglePUSH(e) {
    this.enviarPUSH = this.enviarPUSH == false ? true : false;
    if(this.enviarPUSH == true){
      this.imagenBoton = 'check-on-azul';
      e.target.classList.remove('gris');
      e.target.classList.add('azul');
      document.getElementById('checkPush').classList.remove('gris');
      document.getElementById('checkPush').classList.add('azul');
    } else if(this.enviarPUSH == false){
      this.imagenBoton = 'check-off-gris'
      e.target.classList.remove('azul');
      e.target.classList.add('gris');
      document.getElementById('checkPush').classList.remove('azul');
      document.getElementById('checkPush').classList.add('gris');
    }
  }

  cancelar() {
    let { descripcion, estado, id } = this.voluntariadoSave;
    this.voluntariado = {
      descripcion: descripcion,
      estado: estado,
      id: id,
      fechaCreacion: null
      
    }
    
  }

  confirmar() {
    debugger;
    let status;
    if (this.accion == "cancelar") {
      this.recargar()
      console.log(res => {
        status = 200;
        console.log(res);
        this.alerta(this.accion, status)
      }, err => {
        status = 400;
        console.error(err);
      })
    }
  }

  alerta(accion, status) {
    let accionString = '';
    this.cerrarModal(1)
    if (status == 200) {
      accion == 'cancelo'
      this.mensajeModal = 'Se ' + accionString + ' correctamente';
    }else {
      accion == 'cancelar'
      this.mensajeModal = 'Hubo un fallo al ' + accionString ;
    }
    this.switchModalAlerta = true;
  }

  confirmacion(accion: string) {
    // debugger;
    this.accion = accion;
    this.modalSwitchConfirmacion = true;

    if (accion == 'cancelar') {
      this.mensajeModal = "¿Estás seguro que deseas cancelar?";
      this.textoBotonConfirmacion = "Si"
    }
  }
  
  recargar(){ 
    this.router.navigateByUrl('seccionBienestar', { skipLocationChange: true }).then(() => this.router.navigate(['seccionBienestar']));
   }

  guardarCambios() {
    let cuerpo = {
      id: this.voluntariado.id,
      descripcion: this.voluntariado.descripcion
    }
    this.validacionFechas = true; 
    if(this.enviarPUSH == true){
      this.convertirFechas();
      if(this.fechaInicio < this.fechaFin){
        this.validacionFechas = true;
      }else{
        this.validacionFechas = false;
      }
    }
    if(this.validacionFechas == true){
      this.service.agregarActualizar(cuerpo).subscribe(res => {
        console.log(res);
        if(this.enviarPUSH == true){
          let envio = {
            "titulo": "Voluntariado intergeneracional: Cambio de descripción",
            "subtitulo": this.contenidoPush,
            "fecha_inicio": this.fechaInicio,
            "fecha_final": this.fechaFin,
            "tipo": 1,
            "url": '',
          }
          this.servicePush.guardar(envio).subscribe(res =>{
            let mensaje = 'Se ha modificado correctamente el mensaje';
            this.openSnackBar(mensaje, 'ok');
          }, err => {
            console.log(err);
            let mensaje = 'Se ha modificado correctamente el mensaje, pero hubo un fallo enviando la notificación push';
            this.openSnackBar(mensaje, 'ok');
          })
        }      
      }, err => console.error(err))
    }else{
      let mensaje = 'Rango de fechas no permitido';
      this.openSnackBar(mensaje, 'ok');
    }
  }

  openSnackBar(message: string, action: string) {
    this.modalSwitch = true;
    this.mensajeModal = message;
    // this.snackBar.open(message, action, {
    //   duration: 3500,
    // });
  }

  exportExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.voluntariados);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'voluntariados.xls', { bookType: 'xls', type: 'buffer' });
  }

  convertirFechas(){
    // sacar fecha en un objeto tipo Date()
    let fechaUno = new Date((document.getElementById('fechaInicial') as HTMLInputElement).value);
    let fechaDos = new Date((document.getElementById('fechaFin') as HTMLInputElement).value);
    // Sacar el dia
    let diaUno = fechaUno.getDate() <= 9 ? '0' + fechaUno.getDate() : fechaUno.getDate();
    let diaDos = fechaDos.getDate() <= 9 ? '0' + fechaDos.getDate() : fechaDos.getDate();
    // // Sacar el mes
    let mesUno = fechaUno.getMonth() < 9 ? '0' + (fechaUno.getMonth() + 1).toString() : fechaUno.getMonth() + 1;
    let mesDos = fechaDos.getMonth() < 9 ? '0' + (fechaDos.getMonth() + 1).toString() : fechaDos.getMonth() + 1;
    // // Construir la fecha a String
    this.fechaInicio = fechaUno.getFullYear().toString() + '-' + mesUno.toString() + '-' + diaUno.toString();
    this.fechaFin = fechaDos.getFullYear().toString() + '-' + mesDos.toString() + '-' + diaDos.toString();
  }

  cerrarModal(i) {
    if (i == 0) {
      this.modalSwitchConfirmacion = false;
    }
    if (i == 1) {
      this.switchModalAlerta = false;
      this.recargar();
    }
  }
}
