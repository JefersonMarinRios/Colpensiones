import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilamientoTramitesComponent } from './perfilamiento-tramites.component';

describe('PerfilamientoTramitesComponent', () => {
  let component: PerfilamientoTramitesComponent;
  let fixture: ComponentFixture<PerfilamientoTramitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilamientoTramitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilamientoTramitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
