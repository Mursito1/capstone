import { Component, OnInit } from '@angular/core';
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
    deporte: null,
    premium: false,
    nivel_entrenamiento: '',
    vegetariano: false
  };

  deportes: any[] = [];
  apiUrl = 'https://sportplanner-backend-production-2053.up.railway.app/api/perfil/';
  apiDeportes = 'https://sportplanner-backend-production-2053.up.railway.app/api/deportes/';
  token: string | null = '';
  userId: string | null = '';

  niveles = ['Principiante', 'Intermedio', 'Avanzado'];

  constructor(private http: HttpClient, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('user_id');
    this.cargarDeportes();
    this.cargarPerfil();
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

  cargarPerfil() {
    if (!this.token || !this.userId) return;

    this.http.get(`${this.apiUrl}?user=${this.userId}`, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          this.perfil = data[0];
        }
      },
      error: () => console.log('No existe perfil aún, se creará uno nuevo.')
    });
  }

  guardarPerfil() {
    if (!this.perfil.nombre_completo || !this.perfil.altura || !this.perfil.peso || !this.perfil.nivel_entrenamiento) {
      this.mostrarAlerta('Error', 'Debes completar todos los campos obligatorios.');
      return;
    }

    const payload: any = {
      user: this.userId,
      nombre_completo: this.perfil.nombre_completo,
      altura: this.perfil.altura,
      peso: this.perfil.peso,
      deporte: this.perfil.deporte,
      premium: this.perfil.premium,
      nivel_entrenamiento: this.perfil.nivel_entrenamiento,
      vegetariano: this.perfil.vegetariano
    };

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











