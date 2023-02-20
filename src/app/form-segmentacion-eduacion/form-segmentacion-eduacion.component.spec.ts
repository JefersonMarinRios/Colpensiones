import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSegmentacionEduacionComponent } from './form-segmentacion-eduacion.component';

describe('FormSegmentacionEduacionComponent', () => {
  let component: FormSegmentacionEduacionComponent;
  let fixture: ComponentFixture<FormSegmentacionEduacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSegmentacionEduacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSegmentacionEduacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
