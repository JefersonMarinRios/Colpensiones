import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentacionEduacionComponent } from './segmentacion-eduacion.component';

describe('SegmentacionEduacionComponent', () => {
  let component: SegmentacionEduacionComponent;
  let fixture: ComponentFixture<SegmentacionEduacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentacionEduacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentacionEduacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
