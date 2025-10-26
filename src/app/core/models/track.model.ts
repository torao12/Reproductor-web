export interface Track {
  id: string;
  name: string;
  duration_ms: number;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { name: string }[];
  preview_url: string;
}