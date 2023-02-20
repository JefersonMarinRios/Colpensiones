import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaUsoComponent } from './estadistica-uso.component';

describe('EstadisticaUsoComponent', () => {
  let component: EstadisticaUsoComponent;
  let fixture: ComponentFixture<EstadisticaUsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadisticaUsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticaUsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
