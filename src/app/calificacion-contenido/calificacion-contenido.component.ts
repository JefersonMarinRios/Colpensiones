import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import { Usuario } from '../modelo/usuario';
import { ConfiguracionService } from '../servicios/configuracion/configuracion.service';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'appcolp-calificacion-contenido',
  templateUrl: './calificacion-contenido.component.html',
  styleUrls: ['./calificacion-contenido.component.css']
})
export class CalificacionContenidoComponent implements OnInit {
  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  usuario: Usuario;
  usuarioLog: Usuario | null = null;

  constructor(
    private configuracion: ConfiguracionService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.usuarioLog = JSON.parse(localStorage.getItem('usuarioColp'));
   }

  ngOnInit() {

  }

}
