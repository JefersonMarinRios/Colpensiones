import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaCalorComponent } from './mapa-calor.component';

describe('MapaCalorComponent', () => {
  let component: MapaCalorComponent;
  let fixture: ComponentFixture<MapaCalorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaCalorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaCalorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
