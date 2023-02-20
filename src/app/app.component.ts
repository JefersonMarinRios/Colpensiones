import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';


@Component({
  selector: 'appcolp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  

  constructor(public location: Location) {}

  ngOnInit(){
  }
  title = 'AppColpWeb';

}

