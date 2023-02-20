import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosEducacionComponent } from './eventos-educacion.component';

describe('EventosEducacionComponent', () => {
  let component: EventosEducacionComponent;
  let fixture: ComponentFixture<EventosEducacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventosEducacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventosEducacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
