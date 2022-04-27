import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterPostComponent } from './inter-post.component';

describe('InterPostComponent', () => {
  let component: InterPostComponent;
  let fixture: ComponentFixture<InterPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
