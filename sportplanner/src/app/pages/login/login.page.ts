import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  ],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private alertCtrl: AlertController
  ) {}

  async login() {
    this.apiService.loginUser({ email: this.email, password: this.password }).subscribe({
      next: async (res: any) => {
        const userId = res.user_id;
        const nombre = res.nombre ?? 'Invitado';
        const token = res.token;

        if (!userId || !token) {
          await this.mostrarAlerta('Error', 'Falta user id o token en la respuesta del servidor.');
          return;
        }

        localStorage.setItem('user_id', String(userId));
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('token', token);

        // Redirige a perfil para completarlo o a inicio según sea necesario
        this.router.navigate(['/perfil']);
      },
      error: async (err: any) => {
        await this.mostrarAlerta('Error', err.error?.error || 'Credenciales inválidas o error del servidor');
      }
    });
  }

  async mostrarAlerta(header: string, message: string, buttons: any[] = ['OK']) {
    const alert = await this.alertCtrl.create({ header, message, buttons });
    await alert.present();
  }

  goToRegister() { this.router.navigate(['/register']); }
  goToReset() { this.router.navigate(['/reset']); }
}








