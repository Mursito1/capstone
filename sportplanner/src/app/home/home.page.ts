import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    RouterModule   // IMPORTANTE para routerLink
  ],
})
export class HomePage {}



