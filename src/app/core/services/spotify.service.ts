import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { SpotifySearchResponse } from '../models/spotify-search-response.model';

@Injectable({ providedIn: 'root' })
export class SpotifyService {
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient, private auth: AuthService) {}

  
  searchTracks(query: string): Observable<SpotifySearchResponse> {
  const token = this.auth.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<SpotifySearchResponse>(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
    { headers }
  );
}
}