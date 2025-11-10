import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-progreso',
  templateUrl: './progreso.page.html',
  styleUrls: ['./progreso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProgresoPage implements OnInit, AfterViewInit {

  planes: any[] = [];
  medalla: any[] = [];

  historialFechas: string[] = [];
  historialValores: number[] = [];

  planSeleccionado: any = null;
  ejerciciosPlan: any[] = [];
  modalAbierto = false;

  frecuenciaUsuario = 0;

  @ViewChild('graficoProgreso') graficoProgreso: any;

  constructor(private apiService: ApiService, private alertCtrl: AlertController) {}

  get canCrear(): boolean {
    return this.frecuenciaUsuario > 0 && this.planes.length < this.frecuenciaUsuario;
  }

  ngOnInit() {
    this.cargarPlanes();
    this.cargarPerfil();

    // ✅ Activa cuando tengas endpoints
    // this.cargarMedalla();
    // this.cargarHistorial();
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderGrafico(), 300);
  }

  // ========= PERFIL ==========
  cargarPerfil() {
    this.apiService.getPerfil().subscribe({
      next: (perfil: any) => {
        const perfilData = Array.isArray(perfil) ? perfil[0] : perfil;
        this.frecuenciaUsuario = perfilData?.frecuencia_entrenamiento || 0;
      },
      error: (err: any) => console.error('Error perfil:', err),
    });
  }

  // ========= PLANES ==========
  cargarPlanes() {
    this.apiService.getPlanesUsuario().subscribe({
      next: (data: any) => (this.planes = data),
      error: (err: any) => console.error('Error planes:', err),
    });
  }

  // ========= EJERCICIOS PLAN ==========
  cargarEjercicios(planId: number) {
    this.apiService.getEjerciciosDePlan(planId).subscribe({
      next: (data: any) =>
        (this.ejerciciosPlan = data.map((e: any) => ({
          ...e,
          completado: e.completado || false,
        }))),

      error: (err: any) => console.error('Error ejercicios:', err),
    });
  }

  abrirDetalle(plan: any) {
    this.planSeleccionado = plan;
    this.cargarEjercicios(plan.plan.id);
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.planSeleccionado = null;
  }

  // ========= MARCAR EJERCICIO ==========
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

  async verificarPlanCompletado() {
    const todosCompletos = this.ejerciciosPlan.every((e) => e.completado);

    if (todosCompletos && this.planSeleccionado && !this.planSeleccionado.completado) {
      this.planSeleccionado.completado = true;

      this.apiService.marcarPlanComoCompletado(this.planSeleccionado.plan.id).subscribe({
        next: () => {},
        error: (err: any) => console.error('Error completando plan:', err),
      });

      const alert = await this.alertCtrl.create({
        header: '🏆 Plan completado',
        message: '¡Has completado todos los ejercicios del plan!',
        buttons: ['OK'],
      });
      await alert.present();

      this.cargarPlanes();
      this.modalAbierto = false;
    }
  }

  // ========= ELIMINAR EJERCICIO ==========
  eliminarEjercicio(planId: number, ejercicioId: number) {
    this.apiService.eliminarEjercicio(planId, ejercicioId).subscribe({
      next: () => this.cargarEjercicios(planId),
      error: (err: any) => console.error('Error eliminando ejercicio:', err),
    });
  }

  // ========= GRAFICO ==========
  cargarHistorial() {
    this.apiService.getHistorialEntrenamientos().subscribe({
      next: (data: any) => {
        this.historialFechas = data.map((d: any) => d.fecha);
        this.historialValores = data.map((d: any) => d.cantidad);
        this.renderGrafico();
      },
      error: (err: any) => console.error('Error historial:', err),
    });
  }

  renderGrafico() {
    if (!this.graficoProgreso) return;

    new Chart(this.graficoProgreso.nativeElement, {
      type: 'line',
      data: {
        labels: this.historialFechas,
        datasets: [
          {
            data: this.historialValores,
            borderColor: '#569886',
            backgroundColor: 'rgba(86,152,134,0.25)',
            fill: true,
            tension: 0.3,
            borderWidth: 3,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  // ========= MEDALLAS ==========
  cargarMedalla() {
    this.apiService.getMedallaUsuario().subscribe({
      next: (data: any) => (this.medalla = data),
      error: (err: any) => console.error('Error medallas:', err),
    });
  }

  // ========= CREAR PLAN ==========
  async crearPlan() {
    const nombreAlert = await this.alertCtrl.create({
      header: 'Nuevo entrenamiento',
      message: 'Ingresa un nombre para tu plan:',
      inputs: [{ name: 'nombre', type: 'text', placeholder: 'Ej: Lunes fuerza' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Siguiente',
          handler: async (data) => {
            const nombre = data?.nombre?.trim();
            if (!nombre) {
              this.mostrarAlerta('Error', 'Debes ingresar un nombre.');
              return false;
            }

            const diaAlert = await this.alertCtrl.create({
              header: 'Selecciona el día de la semana',
              inputs: [
                { type: 'radio', label: 'Lunes', value: 1 },
                { type: 'radio', label: 'Martes', value: 2 },
                { type: 'radio', label: 'Miércoles', value: 3 },
                { type: 'radio', label: 'Jueves', value: 4 },
                { type: 'radio', label: 'Viernes', value: 5 },
                { type: 'radio', label: 'Sábado', value: 6 },
                { type: 'radio', label: 'Domingo', value: 7 },
              ],
              buttons: [
                { text: 'Atrás', role: 'cancel' },
                {
                  text: 'Crear',
                  handler: (dia_semana) => {
                    if (!dia_semana) {
                      this.mostrarAlerta('Error', 'Debes seleccionar un día.');
                      return false;
                    }

                    this.apiService.crearPlanUsuario({ nombre, dia_semana }).subscribe({
                      next: async () => {
                        const ok = await this.alertCtrl.create({
                          header: '✅ Creado',
                          message: 'Entrenamiento creado correctamente.',
                          buttons: ['OK'],
                        });
                        await ok.present();
                        this.cargarPlanes();
                      },
                      error: async (err) => {
                        const fail = await this.alertCtrl.create({
                          header: 'Error',
                          message: err.error?.error || 'No se pudo crear.',
                          buttons: ['OK'],
                        });
                        await fail.present();
                      },
                    });

                    return true;
                  },
                },
              ],
            });

            await diaAlert.present();
            return false;
          },
        },
      ],
    });

    await nombreAlert.present();
  }

  // ========= UTIL ==========
  getDiaSemana(num: number): string {
    const dias = {
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
      7: 'Domingo',
    };

    return dias[num as keyof typeof dias] || 'Sin día asignado';
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  // ========= ELIMINAR PLAN =========
eliminarPlan(planId: number) {
  this.apiService.eliminarPlan(planId).subscribe({
    next: async () => {
      const ok = await this.alertCtrl.create({
        header: 'Eliminado',
        message: 'Entrenamiento eliminado correctamente.',
        buttons: ['OK'],
      });
      await ok.present();
      this.cargarPlanes();
    },
    error: (err: any) => console.error('Error al eliminar plan:', err),
  });
}

}
