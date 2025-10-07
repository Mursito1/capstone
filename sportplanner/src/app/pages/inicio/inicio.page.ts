import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InicioPage {
  slides = [
    { img: 'assets/slide1.jpg', title: 'Slide 1' },
    { img: 'assets/slide2.jpg', title: 'Slide 2' },
    { img: 'assets/slide3.webp', title: 'Slide 3' },
  ];

  username: string = 'Invitado';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private menuCtrl: MenuController
  ) {}

  async ionViewWillEnter() {
    // Primero intenta obtener el nombre guardado localmente
    const nombreGuardado = localStorage.getItem('nombre');
    if (nombreGuardado) {
      this.username = nombreGuardado;
    }

    // Luego, intenta refrescar desde la API si hay user_id
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.apiService.getUserById(userId).subscribe({
        next: (res: any) => {
          if (res && res.nombre) {
            this.username = res.nombre;
            localStorage.setItem('nombre', res.nombre); // sincroniza por si cambió
          }
        },
        error: () => {
          console.warn('No se pudo obtener el usuario desde la API');
        },
      });
    }
  }

  goTo(page: string) {
    this.router.navigate([page]);
  }

  openMenu() {
    this.menuCtrl.open('main-menu');
  }
}











