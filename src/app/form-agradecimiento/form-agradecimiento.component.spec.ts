import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAgradecimientoComponent } from './form-agradecimiento.component';

describe('FormAgradecimientoComponent', () => {
  let component: FormAgradecimientoComponent;
  let fixture: ComponentFixture<FormAgradecimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAgradecimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAgradecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
