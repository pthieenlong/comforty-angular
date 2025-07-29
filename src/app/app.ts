import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer, Header } from 'shared/ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['../assets/styles/swiper.css','./app.css']
})
export class App {
  protected title = 'Comforty';
}
