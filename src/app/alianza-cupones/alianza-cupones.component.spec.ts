import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlianzaCuponesComponent } from './alianza-cupones.component';

describe('AlianzaCuponesComponent', () => {
  let component: AlianzaCuponesComponent;
  let fixture: ComponentFixture<AlianzaCuponesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlianzaCuponesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlianzaCuponesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
