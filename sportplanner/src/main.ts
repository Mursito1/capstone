import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, withPreloading, PreloadAllModules, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(
      [
        { path: '', loadComponent: () => import('./app/home/home.page').then(m => m.HomePage) },
        { path: 'register', loadComponent: () => import('./app/pages/register/register.page').then(m => m.RegisterPage) },
        { path: 'reset', loadComponent: () => import('./app/pages/reset/reset.page').then(m => m.ResetPage) },
      ],
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(),
  ],
});





