import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [IonicModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  showTabs = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        const url = this.router.url;

        const shouldHideTabs =
          url === '/' ||
          url.startsWith('/home') ||
          url.startsWith('/login') ||
          url.startsWith('/register') ||
          url.startsWith('/reset');

        this.showTabs = !shouldHideTabs;

        // aplicar padding dinámico
        setTimeout(() => {
          const contents = document.querySelectorAll('ion-content');

          contents.forEach((c: any) => {
            if (this.showTabs) {
              c.classList.add('apply-bottom-space');
            } else {
              c.classList.remove('apply-bottom-space');
            }
          });
        }, 50);
      }
    });
  }

}

