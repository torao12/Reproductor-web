import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Track } from '../../../../core/models/track.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';


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

  constructor(public playerService: PlayerService) {
    this.playlist$ = this.playerService.playlist$;
    this.currentTrack$ = this.playerService.currentTrack$;
  }

  
  ngOnInit(): void {}

  playTrack(track: Track, index: number): void {
    this.playerService.playTrackAtIndex(index);
    this.trackSelected.emit(track);
  }

  isCurrentTrack(track: Track, currentTrack: Track | null): boolean {
    return currentTrack?.id === track.id;
  }
  
}