import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAlertaComponent } from './form-alerta.component';

describe('FormAlertaComponent', () => {
  let component: FormAlertaComponent;
  let fixture: ComponentFixture<FormAlertaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAlertaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAlertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
