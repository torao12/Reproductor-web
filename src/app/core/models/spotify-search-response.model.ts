import { Track } from './track.model';

export interface SpotifySearchResponse {
  tracks: {
    items: Track[];
  };
}