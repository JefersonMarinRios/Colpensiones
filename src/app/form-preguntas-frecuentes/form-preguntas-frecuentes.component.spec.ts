import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPreguntasFrecuentesComponent } from './form-preguntas-frecuentes.component';

describe('FormPreguntasFrecuentesComponent', () => {
  let component: FormPreguntasFrecuentesComponent;
  let fixture: ComponentFixture<FormPreguntasFrecuentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPreguntasFrecuentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPreguntasFrecuentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
