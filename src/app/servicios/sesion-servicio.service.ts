import { Injectable } from '@angular/core';
import { Parametros } from '../modelo/parametros';
import { ParametrosService } from './parametros.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SesionServicioService {


  constructor() {
    // if (this.parametro === null) {
    //this.parametro = JSON.parse(localStorage.getItem('host'));
    // }
  }

  //setURL(parametros:Parametros){
  //  this.parametro = parametros;
  //}
  //getURL(){
  //  if(this.parametro===null){
  //    this.parametroService.parametroHost().subscribe(
  //        res => {
  //          console.log(res);
  //          this.parametro = res;
  //          localStorage.setItem('host', JSON.stringify(this.parametro));
  //        }, error => { console.log(error); });
  //      
  //  }
  //  return this.parametro;
  //}
}
