import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Importar swiper element (ya lo registraste en main.ts con register())
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InicioPage {
  slides = [
    { img: 'assets/slide1.jpg', title: 'Slide 1' },
    { img: 'assets/slide2.jpg', title: 'Slide 2' },
    { img: 'assets/slide3.webp', title: 'Slide 3' },
  ];

  constructor(private router: Router) {}

  goTo(page: string) {
    this.router.navigate([page]);
  }
}









