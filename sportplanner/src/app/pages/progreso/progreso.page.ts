import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-progreso',
  templateUrl: './progreso.page.html',
  styleUrls: ['./progreso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule], // 🔹 IMPORTANTE: Ionic + CommonModule
})
export class ProgresoPage implements OnInit {
  planes: any[] = [];
  planSeleccionado: any = null;
  ejerciciosPlan: any[] = [];
  modalAbierto = false;

  constructor(private apiService: ApiService, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.cargarPlanes();
  }

  // 🟢 Cargar planes del usuario
  cargarPlanes() {
    this.apiService.getPlanesUsuario().subscribe((data) => {
      this.planes = data;
    });
  }

  // 🟢 Abrir detalle del plan seleccionado
  abrirDetalle(plan: any) {
    this.planSeleccionado = plan;
    this.cargarEjercicios(plan.plan.id);
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.planSeleccionado = null;
  }

  // 🟢 Obtener ejercicios de un plan
  cargarEjercicios(planId: number) {
    this.apiService.getEjerciciosDePlan(planId).subscribe((data) => {
      this.ejerciciosPlan = data.map((e: any) => ({
        ...e,
        completado: e.completado || false,
      }));
    });
  }

  // 🟢 Marcar ejercicio como completado
  async marcarEjercicio(detalle: any) {
    detalle.completado = true;

    const alert = await this.alertCtrl.create({
      header: '✔ Ejercicio completado',
      message: `${detalle.ejercicio.nombre} marcado como completado.`,
      buttons: ['OK'],
    });
    await alert.present();

    this.verificarPlanCompletado();
  }

  // 🟢 Si todos los ejercicios están completados → marcar plan completo
  async verificarPlanCompletado() {
    const todosCompletos = this.ejerciciosPlan.every((e) => e.completado);

    if (todosCompletos && this.planSeleccionado && !this.planSeleccionado.completado) {
      this.planSeleccionado.completado = true;

      this.apiService.marcarPlanComoCompletado(this.planSeleccionado.id).subscribe();

      const alert = await this.alertCtrl.create({
        header: '🏅 Plan completado',
        message: '¡Has completado todos los ejercicios de este plan! Medalla obtenida 🏆',
        buttons: ['OK'],
      });
      await alert.present();

      this.cargarPlanes();
      this.modalAbierto = false;
    }
  }

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

