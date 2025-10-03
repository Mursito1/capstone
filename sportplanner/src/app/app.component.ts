import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [IonicModule],          // Importa IonicModule para que reconozca los tags de Ionic
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Para reconocer ion-app, ion-menu, etc.
})
export class AppComponent {

  constructor(private router: Router) {}

  goTo(path: string) {
    this.router.navigate([path]);
  }
}


