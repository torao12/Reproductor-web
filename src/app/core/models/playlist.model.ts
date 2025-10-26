import { Track } from './track.model';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  imageUrl: string;
}