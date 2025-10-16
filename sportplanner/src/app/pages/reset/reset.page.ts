import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonInput, CommonModule, FormsModule]
})
export class ResetPage implements OnInit {

  email: string = '';
  sending: boolean = false;

  constructor(private alertCtrl: AlertController, private router: Router) { }

  ngOnInit() {}

  // UI-only: simulate sending an email (no backend call here)
  async sendReset() {
    if (!this.email || !this.email.includes('@')) {
      const a = await this.alertCtrl.create({ header: 'Correo inválido', message: 'Por favor ingresa un correo válido', buttons: ['OK'] });
      await a.present();
      return;
    }
    this.sending = true;
    // simulate network delay
    setTimeout(async () => {
      this.sending = false;
      const a = await this.alertCtrl.create({ header: 'Enviado', message: 'Si existe una cuenta asociada, recibirás un correo con instrucciones para restablecer la contraseña.', buttons: ['OK'] });
      await a.present();
      this.goBack();
    }, 900);
  }

  goBack() { this.router.navigate(['/']); }

}
