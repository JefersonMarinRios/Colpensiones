import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCuponesComponent } from './menu-cupones.component';

describe('MenuCuponesComponent', () => {
  let component: MenuCuponesComponent;
  let fixture: ComponentFixture<MenuCuponesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCuponesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCuponesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
