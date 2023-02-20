import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasEducacionComponent } from './noticias-educacion.component';

describe('NoticiasEducacionComponent', () => {
  let component: NoticiasEducacionComponent;
  let fixture: ComponentFixture<NoticiasEducacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticiasEducacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiasEducacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
