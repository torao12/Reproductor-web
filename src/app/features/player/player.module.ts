import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerMainComponent } from './components/player-main/player-main.component';
import { PlaylistSidebarComponent } from './components/playlist-sidebar/playlist-sidebar.component';
import { PlayerControlsComponent } from './components/player-controls/player-controls.component';
import { PlayerService } from './services/player.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    PlayerService
  ]
})
export class PlayerModule { }