import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Usuario } from '../modelo/usuario';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { RolService } from '../servicios/rol.service';
import { Rol } from '../modelo/rol';

@Component({
  selector: 'appcolp-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.css']
})
export class FormUsuarioComponent implements OnInit {
  formulario: FormGroup;
  action: string;
  usuario: Usuario;
  dialogTitle: string;
  roles: Rol[];

  constructor(
    public dialogRef: MatDialogRef<FormUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder, private router: Router,
    rolservice: RolService) 
    {
    rolservice.listarTodo().subscribe(res => {
      this.roles = res;
    }, error => { console.log(error); });

    this.action = data.action; // trae el dato undefined
    if (this.action === 'actualizar') {
      this.dialogTitle = 'Usuario';
      this.usuario = data.usuario;
    } else if (this.action === 'new') {
      this.dialogTitle = 'Nuevo Usuario';
      this.usuario = new Usuario();
    }
    this.formulario = this.crearForm();
    this.action = 'new';
    this.usuario = new Usuario();
    this.formulario = this.crearForm();

  }

  crearForm() {
    return this.formBuilder.group({
      id: [this.usuario.id],
      nombre: [this.usuario.nombre],
      colpRol: [this.usuario.colpRol]
    });
  }

  ngOnInit() {
  }

}
