import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositivosMovilesComponent } from './dispositivos-moviles.component';

describe('DispositivosMovilesComponent', () => {
  let component: DispositivosMovilesComponent;
  let fixture: ComponentFixture<DispositivosMovilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispositivosMovilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispositivosMovilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
