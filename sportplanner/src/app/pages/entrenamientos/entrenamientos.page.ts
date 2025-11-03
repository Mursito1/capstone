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
        this.entrenamientos = data.ejercicios_recomendados || [];
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
}




