import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer, Header } from 'shared/ui';
import { LayoutService } from '../shared/services/layout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['../assets/styles/swiper.css', './app.css'],
})
export class App {
  constructor(public layoutService: LayoutService) {}
}
