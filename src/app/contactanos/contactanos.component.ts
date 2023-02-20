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

@Component({
  selector: 'appcolp-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.css']
})
export class ContactanosComponent implements OnInit {

  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  usuario: Usuario;
  constructor(private configuracion: ConfiguracionService,
    private usuarioService: UsuarioService,
    private router: Router) { }

  ngOnInit() {
    if (this.usuarioService.usuarioSesion('todos')) {
      this.router.navigate(['contactanos']);
    }
    this.configuracion.show();
  }

}
