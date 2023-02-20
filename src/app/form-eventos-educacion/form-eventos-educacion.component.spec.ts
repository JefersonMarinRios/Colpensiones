import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEventosEducacionComponent } from './form-eventos-educacion.component';

describe('FormEventosEducacionComponent', () => {
  let component: FormEventosEducacionComponent;
  let fixture: ComponentFixture<FormEventosEducacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEventosEducacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEventosEducacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
