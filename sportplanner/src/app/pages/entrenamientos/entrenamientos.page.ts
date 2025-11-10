import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { EjercicioModalComponent } from './ejercicio-modal.component';

@Component({
  selector: 'app-entrenamientos',
  templateUrl: './entrenamientos.page.html',
  styleUrls: ['./entrenamientos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class EntrenamientosPage implements OnInit {
  entrenamientos: any[] = [];
  deporteRecomendado: string = '';
  nivelRecomendado: string = '';
  cargando: boolean = true;

  constructor(
    private apiService: ApiService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.cargarRecomendaciones();
  }

  cargarRecomendaciones() {
    this.cargando = true;

    this.apiService.getEjerciciosRecomendados().subscribe({
      next: (data) => {
        const ejercicios = data.ejercicios_recomendados || [];
        this.entrenamientos = ejercicios.filter(
          (e: any) => e.imagen_gif && e.imagen_gif.trim() !== ''
        );

        this.deporteRecomendado = data.deporte_recomendado || '';
        this.nivelRecomendado = data.nivel_recomendado || '';

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener recomendaciones:', err);
        this.cargando = false;
      },
    });
  }

  async abrirModal(ejercicio: any) {
    const modal = await this.modalCtrl.create({
      component: EjercicioModalComponent,
      componentProps: { ejercicio },
    });
    await modal.present();
  }

  trackById(index: number, item: any) {
    return item.id || index;
  }

  onGifError(event: any) {
    event.target.src = 'assets/img/no-gif.png'; // fallback profesional
  }

}
