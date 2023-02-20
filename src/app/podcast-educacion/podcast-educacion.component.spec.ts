import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastEducacionComponent } from './podcast-educacion.component';

describe('PodcastEducacionComponent', () => {
  let component: PodcastEducacionComponent;
  let fixture: ComponentFixture<PodcastEducacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastEducacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastEducacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
