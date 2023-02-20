import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeIndisponibilidadComponent } from './mensaje-indisponibilidad.component';

describe('MensajeIndisponibilidadComponent', () => {
  let component: MensajeIndisponibilidadComponent;
  let fixture: ComponentFixture<MensajeIndisponibilidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeIndisponibilidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeIndisponibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
