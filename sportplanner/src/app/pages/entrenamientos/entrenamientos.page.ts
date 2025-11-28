import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { EjercicioModalComponent } from './ejercicio-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrenamientos',
  templateUrl: './entrenamientos.page.html',
  styleUrls: ['./entrenamientos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class EntrenamientosPage implements OnInit {

  usarIA: boolean = true; // IA activada por defecto
  entrenamientos: any[] = [];
  deporteRecomendado: string = '';
  nivelRecomendado: string = '';
  cargando: boolean = true;

  constructor(
    private apiService: ApiService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cargarRecomendaciones();
  }

  // ============================================================
  // 🔄 Cambiar modo IA / NO IA
  // ============================================================
  async cambiarModo() {
    if (!this.usarIA) {
      // ❗ ALERTA ANTES DE VER EJERCICIOS NO RECOMENDADOS
      const alert = await this.alertCtrl.create({
        header: 'Advertencia',
        message:
          'A continuación verás ejercicios que NO están recomendados para tu perfil. ' +
          'Pueden aumentar el riesgo de lesiones o no ser adecuados para tu nivel actual.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.usarIA = true; // vuelve atrás
            },
          },
          {
            text: 'Entendido',
            role: 'confirm',
            handler: () => {
              this.cargarEjerciciosConGif();
            },
          },
        ],
      });

      await alert.present();
      return;
    }

    // Volver a IA → cargar recomendaciones
    this.cargarRecomendaciones();
  }

  // ============================================================
  // 🤖 Obtener ejercicios recomendados por IA
  // ============================================================
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

  // ============================================================
  // 📦 Obtener ejercicios NO IA (solo con GIF)
  // ============================================================
  cargarEjerciciosConGif() {
    this.cargando = true;

    this.apiService.getEjerciciosConGif().subscribe({
      next: (data: any[]) => {
        this.entrenamientos = data; // ya vienen solo con GIF
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar ejercicios con GIF:', err);
        this.cargando = false;
      },
    });
  }


  // ============================================================
  // 🔍 Abrir modal
  // ============================================================
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
    event.target.src = 'assets/img/no-gif.png';
  }
}
