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

import { IdNombre,Departamento,Municipio,Region } from '../modelo/idNombre';

@Component({
  selector: 'appcolp-seccion-educacion',
  templateUrl: './seccion-educacion.component.html',
  styleUrls: ['./seccion-educacion.component.css']
})
export class SeccionEducacionComponent implements OnInit {

  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  usuario: Usuario;

presentacion: string | null = null
  datos: any | null = null;
  constructor(private configuracion: ConfiguracionService,
    private usuarioService: UsuarioService,
    private router: Router) {
      this.datos = [
        {
          'nombre': "Yo soy",
          'icon': 'icon-cupon.svg',
          'dir': 'segmentaciones'
        },
        {
          'nombre': "Noticias",
          'icon': 'icon-eventos.svg',
          'dir': 'noticias'
        },
        {
          'nombre': "Eventos",
          'icon': 'icon-eventos.svg',
          'dir': 'eventos'
        },
        {
          'nombre': "Podcast",
          'icon': 'icon-boletines.svg',
          'dir': 'podcasts'
        },
        {
          'nombre': "Boletines",
          'icon': 'icon-boletines.svg',
          'dir': 'boletines'
        },
      ]
     }
     regresar(){
      this.router.navigate(['home']);
     }

     atras() {
      this.router.navigate(['home']);
    }

  ngOnInit() {
    if (this.usuarioService.usuarioSesion('todos')) {
      this.router.navigate(['seccionEducacion']);
    }
    this.configuracion.show();
  }
}
