import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [IonicModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  constructor(private router: Router, private menuCtrl: MenuController) {}

  goTo(page: string) {
    this.menuCtrl.close();
    this.router.navigate([page]);
  }

  logout() {
    localStorage.clear();
    this.menuCtrl.close().then(() => {
      this.router.navigate(['/home']);
    });
  }
}




