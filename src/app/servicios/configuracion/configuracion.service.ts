import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  navbar: boolean;

  constructor() {
    this.navbar = false;
  }

  hide() { this.navbar = false; }

  show() { this.navbar = true; }

  toggle() { this.navbar = !this.navbar; }
}
