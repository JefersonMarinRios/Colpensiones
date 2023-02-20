import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionBienestarComponent } from './seccion-bienestar.component';

describe('SeccionBienestarComponent', () => {
  let component: SeccionBienestarComponent;
  let fixture: ComponentFixture<SeccionBienestarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeccionBienestarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionBienestarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
