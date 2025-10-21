import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  // Paso actual: 1 = credenciales, 2-4 = perfil
  step = 1;

  // Step 1 - credenciales
  nombre = '';
  email = '';
  password = '';

  // Step 2 - perfil parte 1
  nombre_completo = '';
  altura: number | null = null;
  peso: number | null = null;
  fecha_nacimiento: string | null = null;

  // Step 3 - perfil parte 2
  deporte: number | null = null;
  nivel: number | null = null;
  frecuencia_entrenamiento: number | null = 3;

  // Step 4 - perfil parte 3
  sexo: number | null = null;
  vegetariano = false;

  // Opciones traídas desde API
  deportes: any[] = [];
  niveles: any[] = [];
  sexos: any[] = [];

  loadingOptions = false;

  constructor(
    private api: ApiService,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarOpciones();
  }

  async cargarOpciones() {
    this.loadingOptions = true;
    try {
      const [deportes, niveles, sexos] = await Promise.all([
        this.http.get<any[]>('https://sportplanner-backend-production-2053.up.railway.app/api/deportes/').toPromise(),
        this.http.get<any[]>('https://sportplanner-backend-production-2053.up.railway.app/api/nivel/').toPromise(),
        this.http.get<any[]>('https://sportplanner-backend-production-2053.up.railway.app/api/sexo/').toPromise()
      ]);
      this.deportes = deportes ?? [];
      this.niveles = niveles ?? [];
      this.sexos = sexos ?? [];
    } catch (err) {
      console.warn('No se pudieron cargar opciones:', err);
      const alert = await this.alertCtrl.create({
        header: 'Atención',
        message: 'No se pudieron cargar deportes/niveles/sexos. Intenta más tarde.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.loadingOptions = false;
    }
  }

  // --- Navegación ---
  goNext() {
    if (this.step === 1 && !this.validarStep1()) {
      this.presentAlert('Error', 'Completa usuario, correo y contraseña (mínimo 6 caracteres).');
      return;
    }
    if (this.step === 2) {
      const error = this.validarStep2();
      if (error) {
        this.presentAlert('Error', error);
        return;
      }
    }
    if (this.step === 3) {
      const error = this.validarStep3();
      if (error) {
        this.presentAlert('Error', error);
        return;
      }
    }
    if (this.step < 4) this.step++;
  }

  goBack() {
    if (this.step > 1) this.step--;
  }

  // --- Validaciones ---
  validarStep1(): boolean {
    if (!this.nombre.trim() || !this.email.trim() || !this.password || this.password.length < 6) {
      return false;
    }
    return true;
  }

  validarStep2(): string | null {
    if (!this.nombre_completo.trim()) return 'Nombre completo requerido.';
    if (!this.altura || this.altura <= 0) return 'Altura válida requerida.';
    if (!this.peso || this.peso <= 0) return 'Peso válido requerido.';
    if (!this.fecha_nacimiento) return 'Selecciona fecha de nacimiento.';
    return null;
  }

  validarStep3(): string | null {
    if (!this.deporte) return 'Selecciona un deporte.';
    if (!this.nivel) return 'Selecciona un nivel.';
    if (!this.frecuencia_entrenamiento || this.frecuencia_entrenamiento < 1 || this.frecuencia_entrenamiento > 7) {
      return 'Frecuencia debe estar entre 1 y 7 días.';
    }
    return null;
  }

  validarStep4(): string | null {
    if (!this.sexo) return 'Selecciona un sexo.';
    return null;
  }

  // --- Registro final ---
  async register() {
    const errorStep4 = this.validarStep4();
    if (errorStep4) {
      this.presentAlert('Error', errorStep4);
      return;
    }

    const userPayload = {
      email: this.email,
      password: this.password,
      nombre: this.nombre
    };

    try {
      // 1) Crear usuario
      await this.api.registerUser(userPayload).toPromise();

      // 2) Login automático para token y user_id
      const loginRes: any = await this.api.loginUser({ email: this.email, password: this.password }).toPromise();
      const token = loginRes?.token;
      const userId = loginRes?.user_id ?? loginRes?.userId ?? null;
      if (!token || !userId) {
        await this.presentAlert('Atención', 'Usuario registrado pero no pudimos obtener token automáticamente.');
        return;
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', String(userId));
      localStorage.setItem('nombre', this.nombre);

      // 3) Crear perfil
      const perfilPayload: any = {
        user: userId,
        nombre_completo: this.nombre_completo,
        altura: this.altura,
        peso: this.peso,
        fecha_nacimiento: this.fecha_nacimiento
          ? this.fecha_nacimiento.split('T')[0]  // <-- solo fecha
          : null,
        deporte: this.deporte,
        nivel: this.nivel,
        sexo: this.sexo,
        vegetariano: this.vegetariano,
        frecuencia_entrenamiento: this.frecuencia_entrenamiento
      };

      await this.api.guardarPerfil(perfilPayload).toPromise();

      await this.presentAlert('Éxito', 'Registro y perfil creados correctamente.');
      // Redirigir según UX, por ejemplo: this.router.navigate(['/inicio']);
    } catch (err: any) {
      console.error('Error en registro:', err);
      const msg = err?.error?.error || err?.error?.message || 'Error al registrar. Comprueba la consola.';
      await this.presentAlert('Error', msg);
    }
  }

  async presentAlert(header: string, message: string) {
    const a = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await a.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}






