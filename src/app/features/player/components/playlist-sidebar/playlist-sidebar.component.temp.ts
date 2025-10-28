import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Track } from '../../../../core/models/track.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { SpotifyService } from '../../../../core/services/spotify.service';
import { SpotifySearchResponse } from '../../../../core/models/spotify-search-response.model';

@Component({
  selector: 'app-playlist-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist-sidebar.component.html',
  styleUrls: ['./playlist-sidebar.component.css']
})
export class PlaylistSidebarComponent implements OnInit {
  @Output() trackSelected = new EventEmitter<Track>();
  playlist$: Observable<Track[]>;
  currentTrack$: Observable<Track | null>;

  constructor(
    public playerService: PlayerService,
    private spotifyService: SpotifyService
  ) {
    this.playlist$ = this.playerService.playlist$;
    this.currentTrack$ = this.playerService.currentTrack$;
  }

  ngOnInit(): void {
    this.loadPostMaloneSongs();
  }

  private loadPostMaloneSongs(): void {
    this.spotifyService.searchTracks('Post Malone').subscribe((response: SpotifySearchResponse) => {
      const tracks = response.tracks.items;
      this.playerService.setPlaylist(tracks);
      if (tracks.length > 0 && !this.playerService.getCurrentTrack()) {
        this.playerService.playTrack(tracks[0]);
      }
    });
  }

  playTrack(track: Track, index: number): void {
    this.playerService.playTrackAtIndex(index);
    this.trackSelected.emit(track);
  }

  isCurrentTrack(track: Track, currentTrack: Track | null): boolean {
    return currentTrack?.id === track.id;
  }
}