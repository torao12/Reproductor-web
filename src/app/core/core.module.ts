import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpotifyService } from './services/spotify.service';

@NgModule({

  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    SpotifyService
  ]
})
export class CoreModule { }