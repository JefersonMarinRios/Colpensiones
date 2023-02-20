import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBoletinesEducacionComponent } from './form-boletines-educacion.component';

describe('FormBoletinesEducacionComponent', () => {
  let component: FormBoletinesEducacionComponent;
  let fixture: ComponentFixture<FormBoletinesEducacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBoletinesEducacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBoletinesEducacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
