import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNoticiasEducacionComponent } from './form-noticias-educacion.component';

describe('FormNoticiasEducacionComponent', () => {
  let component: FormNoticiasEducacionComponent;
  let fixture: ComponentFixture<FormNoticiasEducacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNoticiasEducacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNoticiasEducacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
