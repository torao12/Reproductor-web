import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerMain } from './player-main';

describe('PlayerMain', () => {
  let component: PlayerMain;
  let fixture: ComponentFixture<PlayerMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
