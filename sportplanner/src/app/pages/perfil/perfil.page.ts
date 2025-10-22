import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  IonicModule,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  AlertController
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
export class PerfilPage implements OnInit {

  perfil: any = {
    nombre_completo: '',
    altura: null,
    peso: null,
    deporte: null,    // ID del deporte
    premium: false,
    nivel: null,      // ID del nivel
    vegetariano: false,
    sexo: null,       // ID del sexo
    fecha_nacimiento: null
  };

  avatarDataUrl: string | null = null;
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  deportes: any[] = [];
  sexo: any[] = [];
  niveles: any[] = [];

  apiUrl = 'https://sportplanner-backend-production-2053.up.railway.app/api/perfil/';
  apiDeportes = 'https://sportplanner-backend-production-2053.up.railway.app/api/deportes/';
  apiSexo = 'https://sportplanner-backend-production-2053.up.railway.app/api/sexo/';
  apiNiveles = 'https://sportplanner-backend-production-2053.up.railway.app/api/nivel/';
  token: string | null = '';
  userId: string | null = '';

  constructor(private http: HttpClient, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('user_id');
    this.cargarDeportes();
    this.cargarSexo();
    this.cargarNiveles();
    this.cargarPerfil();
  }

  chooseAvatar() {
    try { this.avatarInput.nativeElement.click(); } catch (e) { }
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

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Token ${this.token}` });
  }

  cargarDeportes() {
    this.http.get(this.apiDeportes, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => this.deportes = data,
      error: (err) => console.error('Error cargando deportes', err)
    });
  }

  cargarSexo() {
    this.http.get(this.apiSexo, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => this.sexo = data,
      error: () => console.warn('No se pudieron cargar los valores de sexo')
    });
  }

  cargarNiveles() {
    this.http.get(this.apiNiveles, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => this.niveles = data,
      error: () => console.warn('No se pudieron cargar los niveles')
    });
  }

  cargarPerfil() {
    if (!this.token || !this.userId) return;

    this.http.get(`${this.apiUrl}?user=${this.userId}`, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          const perfil = data[0];

          // Adaptamos nivel, sexo y deporte para que sean sus IDs
          this.perfil = {
            ...perfil,
            nivel: perfil.nivel?.id || perfil.nivel || null,
            sexo: perfil.sexo?.id || perfil.sexo || null,
            deporte: perfil.deporte?.id || perfil.deporte || null
          };

          // Cargamos avatar
          this.avatarDataUrl = perfil.avatar || null;
        }
      },
      error: () => console.log('No existe perfil aún, se creará uno nuevo.')
    });
  }

  guardarPerfil() {
    if (!this.perfil.nombre_completo || !this.perfil.altura || !this.perfil.peso || !this.perfil.nivel || !this.perfil.sexo || !this.perfil.fecha_nacimiento) {
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
      avatar: this.perfil.avatar || null
    };

    if (this.perfil.fecha_nacimiento) {
      const d = new Date(this.perfil.fecha_nacimiento);
      payload.fecha_nacimiento = d.toISOString().split('T')[0]; // YYYY-MM-DD
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
      }
    });
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}















