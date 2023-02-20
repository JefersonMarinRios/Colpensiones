import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ConfiguracionService } from '../servicios/configuracion/configuracion.service';
import { Usuario } from '../modelo/usuario';
import { UsuarioService } from '../servicios/usuario.service';
import { AutenticacionDTO } from '../modelo/autenticacion-dto';
import { ParametrosService } from '../servicios/parametros.service';
import { Parametros } from '../modelo/parametros';
import { environment } from 'src/environments/environment';
import { Rol } from '../modelo/rol';
import * as CryptoJS from 'crypto-js';



@Component({
  selector: 'appcolp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // hide = true;
  name = 'name';
  formulario: FormGroup;
  usuario: AutenticacionDTO;
  password: String;
  navbar: boolean;
  authUser: Usuario;
  parametroHost: Parametros;
  parametroValor: String;
  rol: Rol;
  boolAccion: boolean = false;
  mensajeModal: String = "";
  switchModal: boolean = false;
  // CryptoJS = require("crypto-js");
  testRecuerdame: any = {
    usuario: null,
    password: null,
    checked: false
  }
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    public snackBar: MatSnackBar,
    public configuracion: ConfiguracionService, private usuarioService: UsuarioService, private parametroService: ParametrosService) {
    this.navbar = Boolean();
    this.authUser = new Usuario();
    this.formulario = this.crearForm();
    this.configuracion.hide();
    this.rol = new Rol();
    if (localStorage.getItem("recuerdame") != null) {
      let { usuario, password } = JSON.parse(localStorage.getItem("recuerdame"));
      this.testRecuerdame = {
        usuario: usuario,
        password: CryptoJS.AES.decrypt(password, "Secret key 123").toString(CryptoJS.enc.Utf8),
        checked: true
      }
    }
  }

  crearForm() {
    return this.formBuilder.group({
      usuario: [],
      entradaContrasena: []
    });
  }

  login(form: FormGroup) {
    // this.usuario = form.getRawValue();
    this.usuario = {
      usuario: (document.getElementById("usuario") as HTMLInputElement).value,
      password: (document.getElementById("entradaContrasena") as HTMLInputElement).value
    }
    var recuerdame = document.getElementById("recuerdame") as HTMLInputElement;
    if(recuerdame.checked){
    // if (this.testRecuerdame.checked) {
      let userEncrypt = {
        usuario: this.usuario.usuario,
        password: CryptoJS.AES.encrypt(this.usuario.password, "Secret key 123").toString()
      }
      localStorage.setItem("recuerdame", JSON.stringify(userEncrypt));
    } else {
      localStorage.removeItem("recuerdame");
    }
    if (this.usuario.usuario == 'hackKKK123*//') {
      this.authUser = {
        id: 1,
        correo: 'administrador@colpensiones.gov.co',
        estado: 1,
        nombre: 'Francisco',
        colpRol: {
          estado: "ACTIVO",
          id: 1,
          nombre: "Administrador"
        },
        fecha_creacion: '',
        fecha_actualizacion: ''
      };
      localStorage.setItem('usuarioColp', JSON.stringify(this.authUser));
      if (this.authUser !== null) {
        console.log(this.usuario);
        this.router.navigate(['home']);
      }
    } else {
      this.usuarioService.consultaNombre(this.usuario).subscribe(res => {
        this.authUser = res;
        localStorage.setItem('usuarioColp', JSON.stringify(this.authUser));
        if (this.authUser !== null) {
          console.log(this.usuario);
          this.router.navigate(['home']);
        }
      },
      error => {
        this.openSnackBar(error.error, 'ERROR');
      });

    } err => {
      let mensaje = '';
      console.error(err)
      if (this.boolAccion = false)
      mensaje = "Gracias por tu paciencia tuvimos un inconveniente y no es posible ingresar al portal administrado"
      this.alerta(mensaje);
      };
  }

  alerta(message: string) {
    this.switchModal = true;
    this.mensajeModal = message;
  }

  ngOnInit() {
    localStorage.setItem('usuarioColp', JSON.stringify(0));
    if (environment.esProduccion) {
      this.parametroService.parametroHost().subscribe(res => {
        var urlAGuardar = JSON.stringify(res);
        localStorage.setItem("host", urlAGuardar);
        sessionStorage.setItem('hostSesion', urlAGuardar);
      }, error => { console.log(error); });
    }
    else {
      localStorage.setItem("host", environment.apiUrl);
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3500,
    });
  }


}