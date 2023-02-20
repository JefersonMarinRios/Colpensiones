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
  selector: 'appcolp-seccion-bienestar',
  templateUrl: './seccion-bienestar.component.html',
  styleUrls: ['./seccion-bienestar.component.css']
})
export class SeccionBienestarComponent implements OnInit {

  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  usuario: Usuario;

  datos: any | null = null;
  presentacion: string | null = null

  constructor(private configuracion: ConfiguracionService,
    private usuarioService: UsuarioService,
    private router: Router) {
      this.datos = [
        {
          'nombre': "Alianzas",
          'icon': 'icon-cupon.svg',
          'dir': 'alianzas'
        },
        {
          'nombre': "Eventos",
          'icon': 'icon-eventos.svg',
          'dir': 'eventos'
        },
        {
          'nombre': "Voluntariado Intergeneracional ",
          'icon': 'icon-voluntariado.svg',
          'dir': 'voluntariado'
        },
        {
          'nombre': "Boletines",
          'icon': 'icon-boletines.svg',
          'dir': 'boletines'
        },
      ]
     }

     atras() {
      this.router.navigate(['home']);
    }

  ngOnInit() {
    if (this.usuarioService.usuarioSesion('todos')) {
      this.router.navigate(['seccionBienestar']);
    }
    this.configuracion.show();
  }
  

}
