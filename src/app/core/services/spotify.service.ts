// Servicio que envuelve llamadas a la API de Spotify
// - Usa AuthService para obtener el token y enviar peticiones autenticadas
// - Actualmente sólo implementa `searchTracks` para buscar pistas
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { SpotifySearchResponse } from '../models/spotify-search-response.model';

@Injectable({ providedIn: 'root' })
export class SpotifyService {
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient, private auth: AuthService) {}

  /**
   * searchTracks: realiza una búsqueda simple de pistas usando la API de Spotify
   * - Obtiene el token desde AuthService y lo añade a los headers
   * - Retorna el Observable del HttpClient para que el componente se suscriba
   */
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