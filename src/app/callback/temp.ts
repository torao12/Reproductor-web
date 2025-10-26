import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `<p>Autenticando con Spotify...</p>`
})
export class CallbackComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1));
    const token = params.get('access_token');

    if (token) {
      this.auth.setToken(token);
      this.router.navigate(['/']);
    }
  }
}