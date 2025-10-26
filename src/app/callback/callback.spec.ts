import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackComponent } from './temp';

describe('Callback', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
