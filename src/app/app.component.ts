import { Component } from '@angular/core';
import { SpotifyService } from '../app/core/services/spotify.service';
import { PlayerService } from './features/player/services/player.service';
import { NavbarComponent } from "./core/components/navbar/navbar.component";
import { PlayerMainComponent } from "./features/player/components/player-main/player-main.component";
import { PlaylistSidebarComponent } from "./features/player/components/playlist-sidebar/playlist-sidebar.component";
import { PlayerControlsComponent } from "./features/player/components/player-controls/player-controls.component";
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { SpotifyLoginService } from './core/services/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    NavbarComponent,
    PlayerMainComponent,
    PlaylistSidebarComponent,
    PlayerControlsComponent
  ]
})
export class AppComponent {
  title = 'music-player';

  constructor(
  private spotifyService: SpotifyService,
  private playerService: PlayerService,
  private loginService: SpotifyLoginService,
  private authService: AuthService
) {
  this.loginService.getToken().subscribe((response: { access_token: string }) => {
  const token = response.access_token;
  this.authService.setToken(token);
});



}
  onSearch(query: string): void {
    this.spotifyService.searchTracks(query).subscribe((response: any) => {
  const items = response.tracks.items;
  if (items.length > 0) {
    this.playerService.setPlaylist(items);
    this.playerService.playTrack(items[0]);
  }
});

  }

  loginWithSpotify(): void {
    const clientId = '5b267abe170f468f847b57d7d78cef95';
    const redirectUri = 'https://www.google.com';
    const scopes = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'streaming'
    ];

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes.join(' '))}`;

    window.location.href = authUrl;
  }

}