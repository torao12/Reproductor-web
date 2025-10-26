import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Track } from '../../../core/models/track.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private currentTimeSubject = new BehaviorSubject<number>(0);
  private playlistSubject = new BehaviorSubject<Track[]>([]);
  private currentIndexSubject = new BehaviorSubject<number>(0);

  private audio: HTMLAudioElement | null = null;
  private isShuffleSubject = new BehaviorSubject<boolean>(false);
  private isRepeatSubject = new BehaviorSubject<boolean>(false);
  private simulatedInterval: number | null = null;

  currentTrack$: Observable<Track | null> = this.currentTrackSubject.asObservable();
  isPlaying$: Observable<boolean> = this.isPlayingSubject.asObservable();
  currentTime$: Observable<number> = this.currentTimeSubject.asObservable();
  playlist$: Observable<Track[]> = this.playlistSubject.asObservable();
  isShuffle$: Observable<boolean> = this.isShuffleSubject.asObservable();
  isRepeat$: Observable<boolean> = this.isRepeatSubject.asObservable();

  constructor() {
    this.audio = new Audio();
    this.setupAudioListeners();
  }

  private setupAudioListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audio!.currentTime);
    });

    this.audio.addEventListener('ended', () => {
      this.next();
    });
  }

  setPlaylist(tracks: Track[]): void {
    this.playlistSubject.next(tracks);
  }

  playTrack(track: Track): void {
    this.currentTrackSubject.next(track);

    if (!this.audio || !track.preview_url) {
    this.isPlayingSubject.next(true); 
    this.simulatePlayback(track.duration_ms / 1000);
    return;
  }
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

  togglePlayPause(): void {
  const track = this.currentTrackSubject.value;
  const hasPreview = !!track?.preview_url;

  if (this.isPlayingSubject.value) {
    if (this.audio) {
      this.audio.pause();
    }
    if (this.simulatedInterval !== null) {
      clearInterval(this.simulatedInterval);
      this.simulatedInterval = null;
    }
    this.isPlayingSubject.next(false);
  } else {
    if (hasPreview && this.audio) {
      this.audio.play()
        .then(() => this.isPlayingSubject.next(true))
        .catch(err => {
          console.warn('Error al reanudar:', err);
          this.isPlayingSubject.next(false);
        });
    } else {
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