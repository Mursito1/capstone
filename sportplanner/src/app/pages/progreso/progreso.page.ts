import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  medalla: any[] = [];
  historial: any[] = [];

  planSeleccionado: any = null;
  ejerciciosPlan: any[] = [];
  modalAbierto = false;

  diasSemana: any[] = [];
  frecuenciaUsuario = 0;

  constructor(
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  // ========= LIMITE DE PLANES POR FRECUENCIA =========
  get canCrear(): boolean {
    return this.frecuenciaUsuario > 0 && this.planes.length < this.frecuenciaUsuario;
  }

  // ========= CICLO DE VIDA =========
  ngOnInit() {
    this.cargarPerfil();
    this.cargarMedalla();

    // 1) Carga planes
    // 2) Luego historial
    // 3) Luego genera tabla semana
    this.cargarPlanes(() => {
      this.cargarHistorial();
    });
  }

  // ========= PERFIL =========
  cargarPerfil() {
    this.apiService.getPerfil().subscribe({
      next: (perfil: any) => {
        const data = Array.isArray(perfil) ? perfil[0] : perfil;
        this.frecuenciaUsuario = data?.frecuencia_entrenamiento || 0;
      },
      error: (err: any) => console.error('Error perfil:', err),
    });
  }

  // ========= MEDALLAS =========
  cargarMedalla() {
    this.apiService.getMedallaUsuario().subscribe({
      next: (data: any) => (this.medalla = data),
      error: (err: any) => console.error('Error medallas:', err),
    });
  }

  // ========= PLANES =========
  cargarPlanes(callback?: () => void) {
    this.apiService.getPlanesUsuario().subscribe({
      next: (data: any) => {
        this.planes = data;
        if (callback) {
          callback();
        } else {
          // Si se llama sin callback, igual actualizamos la tabla semanal
          this.generarTablaSemana();
        }
      },
      error: (err: any) => console.error('Error planes:', err),
    });
  }

  // ========= EJERCICIOS DEL PLAN =========
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

  // ========= MARCAR EJERCICIO =========
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

  // ========= VALIDAR PLAN COMPLETADO =========
  async verificarPlanCompletado() {
    const todosCompletos = this.ejerciciosPlan.every((e) => e.completado);

    if (todosCompletos && this.planSeleccionado && !this.planSeleccionado.completado) {
      this.planSeleccionado.completado = true;

      // 1) Marcar plan como completado en backend
      this.apiService.marcarPlanComoCompletado(this.planSeleccionado.plan.id).subscribe({
        error: (err) => console.error('Error completando plan:', err),
      });

      // 2) Registrar en historial
      this.apiService.registrarHistorial({ plan_id: this.planSeleccionado.plan.id }).subscribe({
        next: () => this.cargarHistorial(),
        error: (err) => console.error('Error guardando historial:', err),
      });

      // 3) Alerta de plan completado
      const alert = await this.alertCtrl.create({
        header: '🏆 Plan completado',
        message: '¡Has completado todos los ejercicios del plan!',
        buttons: ['OK'],
      });
      await alert.present();

      // 4) Refrescar planes y tabla semanal
      this.cargarPlanes(() => this.generarTablaSemana());
      this.modalAbierto = false;
    }
  }

  // ========= ELIMINAR EJERCICIO DEL PLAN =========
  eliminarEjercicio(planId: number, ejercicioId: number) {
    this.apiService.eliminarEjercicio(planId, ejercicioId).subscribe({
      next: () => this.cargarEjercicios(planId),
      error: (err: any) => console.error('Error eliminando ejercicio:', err),
    });
  }

  // ========= HISTORIAL (PARA CONTAR ENTRENAMIENTOS) =========
  cargarHistorial() {
    this.apiService.getHistorialAgrupado().subscribe({
      next: async (data: any) => {
        this.historial = data;

        // Total de entrenamientos completados
        const total = data.reduce((acc: number, d: any) => acc + d.cantidad, 0);

        // Alerta especial al llegar exactamente a 10
        if (total === 10) {
          const alerta = await this.alertCtrl.create({
            header: '¡Felicidades!',
            message:
              'Ya completaste <strong>10 entrenamientos</strong>.<br>' +
              'Te recomendamos actualizar tu <strong>peso</strong> y tu <strong>nivel deportivo</strong>.',
            buttons: [
              { text: 'OK', role: 'cancel' },
              {
                text: '¡Vamos!',
                handler: () => this.router.navigate(['/perfil']),
              },
            ],
          });

          await alerta.present();
        }

        this.generarTablaSemana();
      },
      error: (err: any) => {
        console.error('Error historial:', err);
        // Aunque falle el historial, igual generamos la tabla con la info de planes
        this.generarTablaSemana();
      },
    });
  }

  // ========= TABLA SEMANAL =========
  generarTablaSemana() {
    const dias = [
      { id: 1, nombre: 'Lun' },
      { id: 2, nombre: 'Mar' },
      { id: 3, nombre: 'Mié' },
      { id: 4, nombre: 'Jue' },
      { id: 5, nombre: 'Vie' },
      { id: 6, nombre: 'Sáb' },
      { id: 7, nombre: 'Dom' },
    ];

    // Día actual (1 = lunes, ..., 7 = domingo)
    let hoy = new Date().getDay();
    if (hoy === 0) hoy = 7;

    // Mapeamos planes por día para facilitar lectura
    const planesPorDia: Record<number, any> = {};
    this.planes.forEach((p) => {
      const dia = p.plan?.dia_semana;
      if (dia) {
        planesPorDia[dia] = p;
      }
    });

    this.diasSemana = dias.map((d) => {
      const plan = planesPorDia[d.id];

      if (!plan) {
        // No hay entrenamiento asignado ese día
        return { ...d, estado: 'libre' };
      }

      // Si hay plan asignado, vemos su estado
      if (plan.completado) {
        return { ...d, estado: 'completado' };
      }

      // Día futuro o actual → pendiente
      if (d.id >= hoy) {
        return { ...d, estado: 'pendiente' };
      }

      // Día pasado sin completar → no realizado
      return { ...d, estado: 'no_realizado' };
    });
  }

  // ========= UTIL: NOMBRE LARGO DEL DÍA =========
  getDiaSemana(num: number): string {
    const map: any = {
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
      7: 'Domingo',
    };
    return map[num] || '';
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
        this.cargarPlanes(() => this.generarTablaSemana());
      },
      error: (err: any) => console.error('Error al eliminar plan:', err),
    });
  }

  // ========= CREAR PLAN =========
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
                        this.cargarPlanes(() => this.generarTablaSemana());
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
}
