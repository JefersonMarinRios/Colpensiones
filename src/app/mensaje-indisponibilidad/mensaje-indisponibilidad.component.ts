import { Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { exit } from 'process';
import {MatPaginatorModule} from '@angular/material/paginator';
import {PageEvent} from '@angular/material';
import { Usuario } from '../modelo/usuario';
import { ConfiguracionService } from '../servicios/configuracion/configuracion.service';
import { UsuarioService } from '../servicios/usuario.service';
// import {MensajeService} from '../servicios/mensaje-indisponibilidad.service'

@Component({
  selector: 'appcolp-mensaje-indisponibilidad',
  templateUrl: './mensaje-indisponibilidad.component.html',
  styleUrls: ['./mensaje-indisponibilidad.component.css']
})
export class MensajeIndisponibilidadComponent implements OnInit {

  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  usuario: Usuario;
  usuarioLog: Usuario | null = null;
  constructor(
    private configuracion: ConfiguracionService,
    private usuarioService: UsuarioService,
    private router: Router
    ) { 
      this.usuarioLog = JSON.parse(localStorage.getItem('usuarioColp'));
      if(this.usuarioLog.colpRol.id != 1) this.router.navigate(['home']);
    }

  ngOnInit() {
    if (this.usuarioService.usuarioSesion('todos')) {
      this.router.navigate(['mensajeIndisponibilidad']);
    }
    this.configuracion.show();
  }
  
}
