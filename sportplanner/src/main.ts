import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { withPreloading, PreloadAllModules, provideRouter } from '@angular/router';

// Páginas
import { InicioPage } from './app/pages/inicio/inicio.page';

// Swiper (para el carrusel)
import { register } from 'swiper/element/bundle';
register(); // 👈 esto habilita <swiper-container> y <swiper-slide>

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(
      [
        { path: '', loadComponent: () => import('./app/home/home.page').then(m => m.HomePage) },
        { path: 'register', loadComponent: () => import('./app/pages/register/register.page').then(m => m.RegisterPage) },
        { path: 'reset', loadComponent: () => import('./app/pages/reset/reset.page').then(m => m.ResetPage) },
        { path: 'inicio', component: InicioPage },
      ],
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(),
  ],
});






