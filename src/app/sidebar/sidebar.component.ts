import { MediaMatcher } from "@angular/cdk/layout";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dispositivos', title: 'Dispositivos Moviles',  icon: 'pe-7s-graph', class: '' },
    { path: '/uso', title: 'Estadistica de uso',  icon:'pe-7s-user', class: '' },
    { path: '/mapa', title: 'Mapa de calor',  icon:'pe-7s-note2', class: '' },
    { path: '/users', title: 'Usuarios', icon: '', class: ''},
    { path: '/mensajeIndisponibilidad', title: 'Mensaje indisponibilidad', icon: '', class: ''},
    { path: "/archivoPAC", title: "Archivo PAC", icon: "", class: "" },
    { path: "/notificaciones", title: "Notificaciones Push", icon: "", class: "" },
    { path: "/contactanos", title: "Contactanos", icon: "", class: "" },
    { path: "/seccionBienestar", title: "Sección bienestar", icon: "", class: "" },
    { path: "/preguntasFrecuentes", title: "Preguntas frecuentes", icon: "", class: "" },
];
@Component({
  selector: "appcolp-sidebar",
  templateUrl: "./sidebar.component.html",
  // styleUrls: ["../layouts/admin-layout/admin-layout.component.css"],
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  router: any;
  usuarioLog: any = null;
  // Lista de roles
  // id == nombre  
  // 1 == Administrador // DEV
  // 2 == Consultor // DEV
  // 3 == Gestor de Contenidos // DEV
  // 1 == Administrador // PROD
  // 2 == Consultor // PROD
  // 3 == Gestor de Contenidos // PROD

  constructor() {
    this.usuarioLog = JSON.parse(localStorage.getItem('usuarioColp'));
    // console.log(this.usuarioLog);
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }

  home() {
    this.router.navigate(["home"]);
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  cerrar() {
    console.log(JSON.parse(localStorage.getItem('todos')));
    localStorage.removeItem('usuarioColp');
    this.router.navigate(['login']);
  }
}
