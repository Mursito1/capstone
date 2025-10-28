import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-ejercicio-modal',
  templateUrl: './ejercicio-modal.component.html',
  styleUrls: ['./ejercicio-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class EjercicioModalComponent implements OnInit {
  @Input() ejercicio: any;
  planesUsuario: any[] = [];
  creando = false;
  nuevoPlan = { nombre: '', dia_semana: '' };

  constructor(
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cargarPlanes();
  }

  cargarPlanes() {
    this.apiService.getPlanesUsuario().subscribe((data) => {
      this.planesUsuario = data;
    });
  }

  async agregarAEentrenamiento(planId: number) {
    this.apiService
      .agregarEjercicioAPlan(planId, this.ejercicio.id)
      .subscribe(async () => {
        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: 'Ejercicio agregado al plan.',
          buttons: ['OK'],
        });
        await alert.present();
        this.modalCtrl.dismiss();
      });
  }

  async crearPlan() {
    this.apiService.crearPlanUsuario(this.nuevoPlan).subscribe(async (plan) => {
      const alert = await this.alertCtrl.create({
        header: 'Plan creado',
        message: 'Tu nuevo plan ha sido creado correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
      this.cargarPlanes();
      this.creando = false;
    });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
