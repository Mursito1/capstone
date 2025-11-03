import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header translucent>
      <ion-toolbar color="light">
        <ion-title>Selecciona fecha</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-datetime
        presentation="date"
        [(ngModel)]="fechaSeleccionada"
        (ionChange)="onFechaSeleccionada()"
      ></ion-datetime>
    </ion-content>
  `,
})
export class CalendarModalComponent {
  @Input() fechaSeleccionada: string | null = null;

  constructor(private modalCtrl: ModalController) {}

  onFechaSeleccionada() {
    this.modalCtrl.dismiss(this.fechaSeleccionada);
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
