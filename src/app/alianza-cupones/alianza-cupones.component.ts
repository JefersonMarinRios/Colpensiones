import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlianzasBienestarService } from '../servicios/alianzas-bienestar.service';
import { CategoriaAlianzas } from '../modelo/categoria-alianzas';
import { CuponAlianzas } from '../modelo/cupon-alianzas';
import { MatPaginatorModule } from '@angular/material';

@Component({
  selector: 'appcolp-alianza-cupones',
  templateUrl: './alianza-cupones.component.html',
  styleUrls: ['./alianza-cupones.component.css']
})
export class AlianzaCuponesComponent implements OnInit {

  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  

  idAlianza: number | null = null;
  tab: string | null = null;
  categoria: CategoriaAlianzas | null = null; // categoria == alianza
  cupones: CuponAlianzas[] | null = null;


  constructor(
    private service: AlianzasBienestarService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route
      .queryParamMap
      .subscribe(e => {
        this.idAlianza = parseInt(e.get('opc')); // parametro opc es el id de la alianza
      });
  }

  ngOnInit() {
    this.getCategoria();
    this.listarCupones();
  }

  getCategoria() {
    this.service.listarCategorias().subscribe(res => {
      let arreglo: CategoriaAlianzas[] = res;
      this.categoria = arreglo.find(e => e.id == this.idAlianza);
      console.log(this.categoria);
    }, err => {
      console.log(err);
    })
  }

  listarCupones() {
    this.service.listarCupones(this.idAlianza).subscribe(res => {
      this.cupones = res;
      console.log(this.cupones);
    }, err => {
      console.error(err)
    })

  }

}
