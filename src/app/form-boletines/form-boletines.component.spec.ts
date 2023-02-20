import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBoletinesComponent } from './form-boletines.component';

describe('FormBoletinesComponent', () => {
  let component: FormBoletinesComponent;
  let fixture: ComponentFixture<FormBoletinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBoletinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBoletinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
