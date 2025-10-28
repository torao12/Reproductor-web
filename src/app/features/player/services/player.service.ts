// Servicio central del reproductor
// - Mantiene el estado reactivo (Observables) compartido por componentes:
//   currentTrack$, isPlaying$, currentTime$, playlist$, shuffle/repeat
// - Encapsula la lógica de reproducción real con un elemento HTMLAudioElement
// - Tiene una simulación de reproducción cuando la pista no dispone de
//   `preview_url` (útil para demos)
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Track } from '../../../core/models/track.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  // Subjects privados que contienen el estado mutable
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private currentTimeSubject = new BehaviorSubject<number>(0);
  private playlistSubject = new BehaviorSubject<Track[]>([]);
  private currentIndexSubject = new BehaviorSubject<number>(0);

  // Elemento de audio nativo para reproducir previews (si existen)
  private audio: HTMLAudioElement | null = null;
  private isShuffleSubject = new BehaviorSubject<boolean>(false);
  private isRepeatSubject = new BehaviorSubject<boolean>(false);
  // Intervalo utilizado para simular reproducción cuando no hay preview audio
  private simulatedInterval: number | null = null;

  // Observables públicos que consumen los componentes
  currentTrack$: Observable<Track | null> = this.currentTrackSubject.asObservable();
  isPlaying$: Observable<boolean> = this.isPlayingSubject.asObservable();
  currentTime$: Observable<number> = this.currentTimeSubject.asObservable();
  playlist$: Observable<Track[]> = this.playlistSubject.asObservable();
  isShuffle$: Observable<boolean> = this.isShuffleSubject.asObservable();
  isRepeat$: Observable<boolean> = this.isRepeatSubject.asObservable();

  constructor() {
    // Creamos el elemento <audio> y lo configuramos para escuchar eventos
    this.audio = new Audio();
    this.setupAudioListeners();
  }

  /**
   * setupAudioListeners: registra listeners del elemento <audio>
   * - timeupdate: actualiza currentTimeSubject para que la UI muestre progreso
   * - ended: cuando termina una pista, pasa a la siguiente
   */
  private setupAudioListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audio!.currentTime);
    });

    this.audio.addEventListener('ended', () => {
      this.next();
    });
  }

  // Reemplaza la playlist actual del servicio. Los componentes
  // suscritos a `playlist$` recibirán el nuevo array inmediatamente.
  setPlaylist(tracks: Track[]): void {
    this.playlistSubject.next(tracks);
  }

  /**
   * playTrack: pone la pista actual y arranca la reproducción.
   * - Si la pista tiene `preview_url`, la reproducimos con <audio>
   * - Si no, usamos `simulatePlayback` para avanzar el tiempo (demo)
   */
  playTrack(track: Track): void {
    this.currentTrackSubject.next(track);

    // Si no hay audio disponible o la pista no tiene una URL de preview
    // hacemos una simulación (útil para tracks sin preview)
    if (!this.audio || !track.preview_url) {
      this.isPlayingSubject.next(true);
      this.simulatePlayback(track.duration_ms / 1000);
      return;
    }

    // Reproducir preview real
    this.audio.src = track.preview_url;
    this.audio.load();
    this.audio.currentTime = 0;
    this.currentTimeSubject.next(0);

    this.audio.play()
      .then(() => this.isPlayingSubject.next(true))
      .catch(err => {
        console.warn('Error al reproducir:', err);
        this.isPlayingSubject.next(false);
      });
  }

  playTrackAtIndex(index: number): void {
    const playlist = this.playlistSubject.value;
    if (index >= 0 && index < playlist.length) {
      this.currentIndexSubject.next(index);
      this.playTrack(playlist[index]);
    }
  }

  /**
   * togglePlayPause: pausa o reanuda la reproducción según el estado actual.
   * - Si hay audio real y está disponible, se usa el elemento <audio>
   * - Si estamos simulando reproducción, se controla el intervalo
   */
  togglePlayPause(): void {
    const track = this.currentTrackSubject.value;
    const hasPreview = !!track?.preview_url;

    if (this.isPlayingSubject.value) {
      // Pausar reproducción (real o simulada)
      if (this.audio) {
        this.audio.pause();
      }
      if (this.simulatedInterval !== null) {
        clearInterval(this.simulatedInterval);
        this.simulatedInterval = null;
      }
      this.isPlayingSubject.next(false);
    } else {
      // Reanudar: preferir reproducción real si existe preview
      if (hasPreview && this.audio) {
        this.audio.play()
          .then(() => this.isPlayingSubject.next(true))
          .catch(err => {
            console.warn('Error al reanudar:', err);
            this.isPlayingSubject.next(false);
          });
      } else {
        // Simular reproducción cuando no hay preview disponible
        this.isPlayingSubject.next(true);
        this.simulatePlayback(track?.duration_ms ? track.duration_ms / 1000 : 30);
      }
    }
  }

  next(): void {
    const playlist = this.playlistSubject.value;
    let nextIndex = this.currentIndexSubject.value + 1;

    if (this.isShuffleSubject.value) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else if (nextIndex >= playlist.length) {
      if (this.isRepeatSubject.value) {
        nextIndex = 0;
      } else {
        this.stop();
        return;
      }
    }

    this.playTrackAtIndex(nextIndex);
  }

  previous(): void {
    const playlist = this.playlistSubject.value;
    let prevIndex = this.currentIndexSubject.value - 1;

    if (prevIndex < 0) {
      prevIndex = playlist.length - 1;
    }

    this.playTrackAtIndex(prevIndex);
  }

  seek(time: number): void {
    if (this.audio && !isNaN(this.audio.duration)) {
      this.audio.currentTime = time;
      this.currentTimeSubject.next(time);
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlayingSubject.next(false);
    }
  }

  toggleShuffle(): void {
    this.isShuffleSubject.next(!this.isShuffleSubject.value);
  }

  toggleRepeat(): void {
    this.isRepeatSubject.next(!this.isRepeatSubject.value);
  }

  getCurrentTrack(): Track | null {
    return this.currentTrackSubject.value;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }
  /**
   * simulatePlayback: cuando no hay preview disponible, avanzamos el tiempo
   * internamente cada segundo para dar la sensación de reproducción.
   * Al terminar la duración, se detiene y se avanza a la siguiente pista.
   */
  private simulatePlayback(duration: number): void {
    let time = 0;
    this.currentTimeSubject.next(0);

    if (this.simulatedInterval !== null) {
      clearInterval(this.simulatedInterval);
      this.simulatedInterval = null;
    }

    this.simulatedInterval = setInterval(() => {
      time += 1;
      this.currentTimeSubject.next(time);

      if (time >= duration) {
        if (this.simulatedInterval !== null) {
          clearInterval(this.simulatedInterval);
          this.simulatedInterval = null;
        }
        this.isPlayingSubject.next(false);
        this.next();
      }
    }, 1000);
  }
}