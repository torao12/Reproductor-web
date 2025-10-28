// Componente principal del reproductor
// - Orquesta la UI principal: barra de búsqueda, vista del reproductor y sidebar
// - Suscribe a streams del PlayerService para mantener sincronía (pista actual,
//   tiempo, estado de reproducción, playlist, shuffle/repeat)
// - Maneja la búsqueda (delegando a SpotifyService) y la navegación entre
//   vista de búsqueda y vista del reproductor
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaylistSidebarComponent } from '../playlist-sidebar/playlist-sidebar.component';
import { PlayerService } from '../../services/player.service';
import { SpotifyService } from '../../../../core/services/spotify.service';
import { Track } from '../../../../core/models/track.model';
import { SpotifySearchResponse } from '../../../../core/models/spotify-search-response.model';

@Component({
  selector: 'app-player-main',
  standalone: true,
  imports: [CommonModule, FormsModule, PlaylistSidebarComponent],
  templateUrl: './player-main.component.html',
  styleUrls: ['./player-main.component.css']
})
export class PlayerMainComponent implements OnInit, OnDestroy {
  currentTrack: Track | null = null;
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  isShuffle = false;
  isRepeat = false;
  isLiked = false;
  tracks: Track[] = [];
  searchQuery = '';
  isSearching = false;
  searchResults: {
    tracks: Track[];
    artists: any[];
    albums: any[];
  } = {
    tracks: [],
    artists: [],
    albums: []
  };

  private destroy$ = new Subject<void>();

  constructor(
    public playerService: PlayerService,
    private spotifyService: SpotifyService
  ) {}

  // onTrackSelect: manejador usado por la vista de búsqueda y el sidebar
  // cuando el usuario selecciona una pista.
  // - Reproduce la pista usando PlayerService
  // - Cambia la UI para volver a la vista principal del reproductor

  onTrackSelect(track: Track): void {
    this.playerService.playTrack(track);
    this.isSearching = false; // Regresa a la vista del reproductor
  }

  ngOnInit(): void {
    // Suscribirse a la pista actual: cada vez que cambia se actualizan
    // propiedades locales (currentTrack, duration, currentTime)
    this.playerService.currentTrack$
      .pipe(takeUntil(this.destroy$))
      .subscribe(track => {
        this.currentTrack = track;
        this.currentTime = 0;
        if (track) {
          this.duration = track.duration_ms / 1000;
        }
      });

    this.playerService.isPlaying$
      .pipe(takeUntil(this.destroy$))
      .subscribe(playing => {
        this.isPlaying = playing;
      });

    this.playerService.currentTime$
      .pipe(takeUntil(this.destroy$))
      .subscribe(time => {
        this.currentTime = time;
      });

    this.playerService.isShuffle$
      .pipe(takeUntil(this.destroy$))
      .subscribe(shuffle => {
        this.isShuffle = shuffle;
      });

    this.playerService.isRepeat$
      .pipe(takeUntil(this.destroy$))
      .subscribe(repeat => {
        this.isRepeat = repeat;
      });

    this.playerService.playlist$
      .pipe(takeUntil(this.destroy$))
      .subscribe((playlist: Track[]) => {
        this.tracks = playlist;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.isSearching = true;
      this.spotifyService.searchTracks(this.searchQuery).subscribe((response: SpotifySearchResponse) => {
        this.searchResults.tracks = response.tracks.items;
        // Aquí podrías agregar la lógica para buscar artistas y álbumes
      });
    }
  }

  backToPlayer(): void {
    this.isSearching = false;
    this.searchQuery = '';
    this.searchResults = {
      tracks: [],
      artists: [],
      albums: []
    };
  }

  togglePlayPause(): void {
    this.playerService.togglePlayPause();
  }

  next(): void {
    this.playerService.next();
  }

  previous(): void {
    this.playerService.previous();
  }

  toggleShuffle(): void {
    this.playerService.toggleShuffle();
  }

  toggleRepeat(): void {
    this.playerService.toggleRepeat();
  }

  toggleLike(): void {
    this.isLiked = !this.isLiked;
  }

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    const time = parseFloat(input.value);
    this.playerService.seek(time);
  }

  /**
   * formatTime: utilidad para mostrar segundos como mm:ss
   */

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  get progress(): number {
    return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }
  onTrackSelected(track: Track): void {
  this.playerService.playTrack(track); 
}

}