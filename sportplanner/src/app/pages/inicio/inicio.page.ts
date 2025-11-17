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
    { img: 'assets/sparta_header.png', title: 'Sparta' },
    { img: 'assets/nike.webp', title: 'Nike' },
    { img: 'assets/ultimatefitn.jpg', title: 'Ultimate Fit' },
  ];

  username: string = 'Invitado';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private menuCtrl: MenuController
  ) {}

  async ionViewWillEnter() {
    const nombreGuardado = localStorage.getItem('nombre');
    if (nombreGuardado) {
      this.username = nombreGuardado;
    }

    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.apiService.getUserById(userId).subscribe({
        next: (res: any) => {
          if (res && res.nombre) {
            this.username = res.nombre;
            localStorage.setItem('nombre', res.nombre);
          }
        },
        error: () => {
          console.warn('No se pudo obtener el usuario desde la API');
        },
      });
    }
  }

  // Navegación usando router
  goTo(page: string) {
    this.router.navigate([page]);
  }
  
  goToEntrenamientos() {
    this.router.navigate(['/entrenamientos']);
  }

  openMenu() {
    this.menuCtrl.open('main-menu');
  }

  ejerciciosRandom: any[] = [];

  ngOnInit() {
    this.getRandomEjercicios();
  }

  getRandomEjercicios() {
    this.apiService.getRandomEjercicios(2).subscribe({
      next: (data) => {
        this.ejerciciosRandom = data;
      },
      error: (err) => {
        console.error("Error cargando ejercicios random", err);
      }
    });
  }
}












