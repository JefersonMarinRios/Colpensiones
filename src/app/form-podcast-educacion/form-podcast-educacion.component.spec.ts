import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPodcastEducacionComponent } from './form-podcast-educacion.component';

describe('FormPodcastEducacionComponent', () => {
  let component: FormPodcastEducacionComponent;
  let fixture: ComponentFixture<FormPodcastEducacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPodcastEducacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPodcastEducacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
