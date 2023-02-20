import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionContenidoComponent } from './calificacion-contenido.component';

describe('CalificacionContenidoComponent', () => {
  let component: CalificacionContenidoComponent;
  let fixture: ComponentFixture<CalificacionContenidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalificacionContenidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificacionContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
