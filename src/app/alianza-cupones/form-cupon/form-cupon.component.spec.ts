import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCuponComponent } from './form-cupon.component';

describe('FormCuponComponent', () => {
  let component: FormCuponComponent;
  let fixture: ComponentFixture<FormCuponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCuponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCuponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
