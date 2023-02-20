import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMasInformacionComponent } from './sub-mas-informacion.component';

describe('SubMasInformacionComponent', () => {
  let component: SubMasInformacionComponent;
  let fixture: ComponentFixture<SubMasInformacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubMasInformacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMasInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
