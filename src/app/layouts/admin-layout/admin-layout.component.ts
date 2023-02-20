import { Component, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionService } from '../../servicios/configuracion/configuracion.service';
import { Usuario } from '../../modelo/usuario';
import { UsuarioService } from '../../servicios/usuario.service';


@Component({
  selector: 'appcolp-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  navbar: boolean;
  usuario: Usuario;

  // tiempo de incatividad
  tiempo: number = 0;
  interval: any = null;

  @Output() test: any = this.cerrar

  @HostListener('document:mousemove', ['$event']) onMouseMove(e: MouseEvent) {
    this.tiempo = 0;
  }

  constructor(private router: Router, public configuracion: ConfiguracionService,
    public usuarioService: UsuarioService) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    let item = localStorage.getItem('usuarioColp')
    // console.log(item);
    // if (this.usuarioService.usuarioSesion('todos')) {
    //   this.router.navigate(['login']);
    // }
    // this.configuracion.show();
    if(item == null || item == '0'){
      this.router.navigate(['login']);
    }else{
      this.interval = setInterval(() => this.incrementInterval(), 1000)
    }
  }

  incrementInterval(){
    if(this.tiempo < 300){
      this.tiempo = this.tiempo + 1;
      // console.log('Tiempo trasncurrido: ', this.tiempo);
    } else{
      console.log('Tiempo total: ', this.tiempo);
      this.cerrar()
    }
  }

  // Salir de sesion
  cerrar(){
    clearInterval(this.interval);
    console.log(this.interval);
    localStorage.removeItem('usuarioColp');
    this.tiempo = 0;
    console.log('Se acabo el tiempo');
    console.log("Se cerro la sesion");
    this.router.navigate(['login']);
  }
  
  ngOnDestroy(){
    clearInterval(this.interval);
  }
  
}
