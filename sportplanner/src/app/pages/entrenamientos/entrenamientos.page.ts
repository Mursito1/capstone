import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-entrenamientos',
  templateUrl: './entrenamientos.page.html',
  styleUrls: ['./entrenamientos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class EntrenamientosPage implements OnInit {
  entrenamientos: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarEntrenamientos();
  }

  cargarEntrenamientos() {
    this.apiService.getEntrenamientosRecomendados().subscribe((data) => {
      this.entrenamientos = data;
    });
  }

  seleccionarEntrenamiento(entrenamiento: any) {
    console.log('Revisar ejercicio:', entrenamiento);
  }
}


