import { Component, Input, OnInit } from '@angular/core';
import { Track } from '../../../../core/models/track.model';
import { PlayerService } from '../../services/player.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-player-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.css'],
})
export class PlayerControlsComponent implements OnInit {
  @Input() track!: Track;


  isPlaying = false;
  currentTime = 0;
  duration = 0;

  constructor(public playerService: PlayerService) {}

  ngOnInit(): void {
    if (this.track) {
      this.duration = this.track.duration_ms / 1000;
    }

    this.playerService.isPlaying$.subscribe(playing => {
      this.isPlaying = playing;
    });

    this.playerService.currentTime$.subscribe(time => {
      this.currentTime = time;
    });
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

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    const time = parseFloat(input.value);
    this.playerService.seek(time);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  get progress(): number {
    return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }
}