import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistSidebar } from './playlist-sidebar';

describe('PlaylistSidebar', () => {
  let component: PlaylistSidebar;
  let fixture: ComponentFixture<PlaylistSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
