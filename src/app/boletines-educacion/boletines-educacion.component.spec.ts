import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletinesEducacionComponent } from './boletines-educacion.component';

describe('BoletinesEducacionComponent', () => {
  let component: BoletinesEducacionComponent;
  let fixture: ComponentFixture<BoletinesEducacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoletinesEducacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoletinesEducacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
