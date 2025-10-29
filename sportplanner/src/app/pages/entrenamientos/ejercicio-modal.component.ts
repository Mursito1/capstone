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
  frecuenciaUsuario: number = 0; // frecuencia de entrenamientos del perfil

  constructor(
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cargarPlanes();
    this.cargarPerfil();
  }

  // 🟢 Carga los planes del usuario
  cargarPlanes() {
    this.apiService.getPlanesUsuario().subscribe((data) => {
      this.planesUsuario = data;
    });
  }

  // 🟢 Obtiene la frecuencia del perfil del usuario
  cargarPerfil() {
    this.apiService.getPerfil().subscribe((perfil) => {
      this.frecuenciaUsuario = perfil.frecuencia_entrenamiento || 0;
    });
  }

  // 🟢 Agrega ejercicio al plan
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

  // 🟢 Crea un nuevo plan de entrenamiento
  async crearPlan() {
    // Si ya alcanzó la frecuencia, no permitir más planes
    if (this.planesUsuario.length >= this.frecuenciaUsuario) {
      const alert = await this.alertCtrl.create({
        header: 'Límite alcanzado',
        message: 'Ya tienes todos tus entrenamientos semanales asignados.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    this.apiService.crearPlanUsuario(this.nuevoPlan).subscribe(async () => {
      const alert = await this.alertCtrl.create({
        header: 'Plan creado',
        message: 'Tu nuevo plan ha sido creado correctamente.',
        buttons: ['OK'],
      });
      await alert.present();

      this.cargarPlanes();
      this.creando = false;
      this.nuevoPlan = { nombre: '', dia_semana: '' };
    });
  }

  // 🟢 Cierra el modal
  cerrar() {
    this.modalCtrl.dismiss();
  }

  // 🟢 Traduce número a nombre de día
  getDiaSemana(num: number): string {
    const dias: Record<number, string> = {
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
      7: 'Domingo',
    };
    return dias[num] || 'Sin día asignado';
  }
}

