import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { withPreloading, PreloadAllModules, provideRouter } from '@angular/router';

// Guards
import { AuthGuard } from 'src/app/guards/auth-guard';

// Páginas
import { InicioPage } from './app/pages/inicio/inicio.page';
import { PerfilPage } from './app/pages/perfil/perfil.page';
import { EntrenamientosPage } from './app/pages/entrenamientos/entrenamientos.page';
import { TiendaPage } from './app/pages/tienda/tienda.page';
import { ProgresoPage } from './app/pages/progreso/progreso.page';

// Swiper
import { register } from 'swiper/element/bundle';
register();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(
      [
        { path: '', loadComponent: () => import('./app/home/home.page').then(m => m.HomePage) },
        { path: 'home', loadComponent: () => import('./app/home/home.page').then(m => m.HomePage) },
        { path: 'login', loadComponent: () => import('./app/pages/login/login.page').then(m => m.LoginPage) },
        { path: 'register', loadComponent: () => import('./app/pages/register/register.page').then(m => m.RegisterPage) },
        { path: 'reset', loadComponent: () => import('./app/pages/reset/reset.page').then(m => m.ResetPage) },

        // ✅ Rutas protegidas
        { path: 'inicio', component: InicioPage, canActivate: [AuthGuard] },
        { path: 'perfil', component: PerfilPage, canActivate: [AuthGuard] },
        { path: 'entrenamientos', component: EntrenamientosPage, canActivate: [AuthGuard] },
        { path: 'tienda', component: TiendaPage, canActivate: [AuthGuard] },
        { path: 'progreso', component: ProgresoPage, canActivate: [AuthGuard] },
      ],
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(),
  ],
});