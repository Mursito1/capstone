import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';  // ← importante
import { ApiService } from '../../services/api.service'; // ajusta la ruta según tu proyecto

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule], // aquí va todo
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email = '';
  password = '';
  nombre = '';

  constructor(private apiService: ApiService, private alertCtrl: AlertController) {}

  register() {
    const user = { email: this.email, password: this.password, nombre: this.nombre };
    this.apiService.registerUser(user).subscribe({
      next: async (res: any) => {
        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: 'Usuario registrado correctamente',
          buttons: ['OK']
        });
        await alert.present();
      },
      error: async (err: any) => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'No se pudo registrar el usuario',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}


