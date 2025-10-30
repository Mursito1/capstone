import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, IonIcon } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-progreso',
  templateUrl: './progreso.page.html',
  styleUrls: ['./progreso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProgresoPage implements OnInit {
  planes: any[] = [];
  planSeleccionado: any = null;
  ejerciciosPlan: any[] = [];
  modalAbierto = false;
  frecuenciaUsuario = 0;

  constructor(private apiService: ApiService, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.cargarPlanes();
    this.cargarPerfil();
  }

  get canCrear(): boolean {
    return this.frecuenciaUsuario > 0 && this.planes.length < this.frecuenciaUsuario;
  }

  cargarPerfil() {
    this.apiService.getPerfil().subscribe({
      next: (perfil) => {
        const perfilData = Array.isArray(perfil) ? perfil[0] : perfil;
        this.frecuenciaUsuario = perfilData?.frecuencia_entrenamiento || 0;
      },
      error: (err) => console.error('Error al cargar perfil:', err),
    });
  }

  cargarPlanes() {
    this.apiService.getPlanesUsuario().subscribe({
      next: (data) => (this.planes = data),
      error: (err) => console.error('Error al cargar planes:', err),
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

  cargarEjercicios(planId: number) {
    this.apiService.getEjerciciosDePlan(planId).subscribe({
      next: (data) => {
        this.ejerciciosPlan = data.map((e: any) => ({
          ...e,
          completado: e.completado || false,
        }));
      },
      error: (err) => console.error('Error al cargar ejercicios:', err),
    });
  }

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

  async crearPlan() {
    // Paso 1: pedir nombre
    const nombreAlert = await this.alertCtrl.create({
        header: 'Nuevo entrenamiento',
        message: 'Ingresa un nombre para tu plan:',
        inputs: [
        {
            name: 'nombre',
            type: 'text',
            placeholder: 'Ej: Lunes fuerza',
        },
        ],
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

            // Paso 2: elegir día
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

                    // Llamar al backend
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
                            message: err.error?.error || 'No se pudo crear el entrenamiento.',
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
            return false; // no cerrar el primer alert aún
            },
        },
        ],
    });

    await nombreAlert.present();
    }

  async eliminarPlan(planId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar entrenamiento',
      message: '¿Seguro que deseas eliminar este entrenamiento y todos sus ejercicios?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
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
              error: (err) => console.error('Error al eliminar plan:', err),
            });
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  eliminarEjercicio(planId: number, ejercicioId: number) {
    this.apiService.eliminarEjercicio(planId, ejercicioId).subscribe({
      next: () => this.cargarEjercicios(planId),
      error: (err) => console.error('Error al eliminar ejercicio:', err),
    });
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

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}