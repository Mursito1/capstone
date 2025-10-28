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

  constructor(
    private apiService: ApiService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.cargarEntrenamientos();
  }

  cargarEntrenamientos() {
    this.apiService.getEntrenamientosRecomendados().subscribe((data) => {
      this.entrenamientos = data;
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



