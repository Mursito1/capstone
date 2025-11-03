import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CalendarModalComponent } from './calendar-modal.component';
import {
  IonicModule,
  IonModal,
  ModalController,
  PopoverController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit, OnDestroy {
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;
  @ViewChild('calModal', { static: false }) calModal!: IonModal;

  perfil: any = {
    nombre_completo: '',
    altura: null,
    peso: null,
    deporte: null,
    premium: false,
    nivel: null,
    vegetariano: false,
    sexo: null,
    fecha_nacimiento: null,
  };

  avatarDataUrl: string | null = null;

  deportes: any[] = [];
  sexo: any[] = [];
  niveles: any[] = [];

  apiUrl = 'https://sportplanner-backend-production-2053.up.railway.app/api/perfil/';
  apiDeportes = 'https://sportplanner-backend-production-2053.up.railway.app/api/deportes/';
  apiSexo = 'https://sportplanner-backend-production-2053.up.railway.app/api/sexo/';
  apiNiveles = 'https://sportplanner-backend-production-2053.up.railway.app/api/nivel/';
  token: string | null = '';
  userId: string | null = '';

  mostrarCalendario = false;

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  // -------------------------------------------------------
  // Ciclo de vida
  // -------------------------------------------------------
  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('user_id');
    this.cargarDeportes();
    this.cargarSexo();
    this.cargarNiveles();
    this.cargarPerfil();

    // 🔹 Limpieza defensiva de overlays antiguos
    this.limpiarCacheModales();
  }

  ngOnDestroy() {
    this.limpiarCacheModales();
  }

  // -------------------------------------------------------
  // Avatar
  // -------------------------------------------------------
  chooseAvatar() {
    try {
      this.avatarInput.nativeElement.click();
    } catch {}
  }

  onAvatarSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarDataUrl = reader.result as string;
      this.perfil.avatar = this.avatarDataUrl;
    };
    reader.readAsDataURL(file);
  }

  // -------------------------------------------------------
  // API
  // -------------------------------------------------------
  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Token ${this.token}` });
  }

  cargarDeportes() {
    this.http.get(this.apiDeportes, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => (this.deportes = data),
      error: (err) => console.error('Error cargando deportes', err),
    });
  }

  cargarSexo() {
    this.http.get(this.apiSexo, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => (this.sexo = data),
      error: () => console.warn('No se pudieron cargar los valores de sexo'),
    });
  }

  cargarNiveles() {
    this.http.get(this.apiNiveles, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => (this.niveles = data),
      error: () => console.warn('No se pudieron cargar los niveles'),
    });
  }

  cargarPerfil() {
    if (!this.token || !this.userId) return;

    this.http.get(`${this.apiUrl}?user=${this.userId}`, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          const perfil = data[0];
          this.perfil = {
            ...perfil,
            nivel: perfil.nivel?.id || perfil.nivel || null,
            sexo: perfil.sexo?.id || perfil.sexo || null,
            deporte: perfil.deporte?.id || perfil.deporte || null,
          };
          this.avatarDataUrl = perfil.avatar || null;
        }
      },
      error: () => console.log('No existe perfil aún, se creará uno nuevo.'),
    });
  }

  guardarPerfil() {
    this.limpiarCacheModales(); // 🧹 seguridad extra

    if (
      !this.perfil.nombre_completo ||
      !this.perfil.altura ||
      !this.perfil.peso ||
      !this.perfil.nivel ||
      !this.perfil.sexo ||
      !this.perfil.fecha_nacimiento
    ) {
      this.mostrarAlerta('Error', 'Debes completar todos los campos obligatorios.');
      return;
    }

    const payload: any = {
      user: Number(this.userId),
      nombre_completo: this.perfil.nombre_completo,
      altura: Number(this.perfil.altura),
      peso: Number(this.perfil.peso),
      deporte: this.perfil.deporte ? Number(this.perfil.deporte) : null,
      premium: Boolean(this.perfil.premium),
      nivel: this.perfil.nivel ? Number(this.perfil.nivel) : null,
      vegetariano: Boolean(this.perfil.vegetariano),
      sexo: this.perfil.sexo ? Number(this.perfil.sexo) : null,
      avatar: this.perfil.avatar || null,
    };

    if (this.perfil.fecha_nacimiento) {
      const d = new Date(this.perfil.fecha_nacimiento);
      payload.fecha_nacimiento = d.toISOString().split('T')[0];
    }

    const request = this.perfil.id
      ? this.http.put(`${this.apiUrl}${this.perfil.id}/`, payload, { headers: this.getAuthHeaders() })
      : this.http.post(this.apiUrl, payload, { headers: this.getAuthHeaders() });

    request.subscribe({
      next: (res: any) => {
        if (!this.perfil.id && res.id) this.perfil.id = res.id;
        this.mostrarAlerta('Éxito', 'Perfil guardado correctamente.');
      },
      error: (err) => {
        console.error(err);
        this.mostrarAlerta('Error', 'No se pudo guardar el perfil. Verifica los campos.');
      },
    });
  }

  // -------------------------------------------------------
  // Calendario
  // -------------------------------------------------------
  async abrirCalendario() {
    const modal = await this.modalCtrl.create({
      component: CalendarModalComponent, // lo definimos más abajo
      cssClass: 'calendario-modal',
      componentProps: {
        fechaSeleccionada: this.perfil.fecha_nacimiento,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.perfil.fecha_nacimiento = result.data;
      }
    });

    await modal.present();
  }

  // -------------------------------------------------------
  // 🧹 Limpieza global de modales y overlays
  // -------------------------------------------------------
  async limpiarCacheModales() {
    // Cierra con los controladores
    try { await this.modalCtrl.dismiss(); } catch {}
    try { await this.popoverCtrl.dismiss(); } catch {}
    try { await this.actionSheetCtrl.dismiss(); } catch {}

    // Elimina restos visuales
    const modals = document.querySelectorAll('ion-modal, ion-popover, ion-action-sheet, ion-backdrop');
    modals.forEach((el: any) => {
      try { el.remove(); } catch {}
    });

    // Asegura foco para volver a usar inputs
    (document.activeElement as HTMLElement)?.blur();
    document.body.focus();

    console.log('🧹 Limpieza completa de overlays ejecutada');
  }

  // -------------------------------------------------------
  // Alertas
  // -------------------------------------------------------
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}
