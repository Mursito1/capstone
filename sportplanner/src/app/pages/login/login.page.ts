import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonButton 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    CommonModule, 
    FormsModule
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
        localStorage.setItem('user_id', res.user.id);
        localStorage.setItem('token', res.token);
        localStorage.setItem('nombre', res.user.nombre);

        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: 'Inicio de sesión correcto',
          buttons: ['OK']
        });
        await alert.present();

        this.router.navigate(['/inicio']); // navega a la página de inicio
      },
      error: async (err) => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err.error.error || 'Error al iniciar sesión',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToReset() {
    this.router.navigate(['/reset']);
  }
}