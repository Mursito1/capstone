import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id?: number;
  email: string;
  password: string;
  nombre?: string;
}

export interface RegistroUsuario {
  email: string;
  password: string;
  nombre_completo: string;
  altura: number;
  peso: number;
  fecha_nacimiento: string;
  deporte: number | null;
  nivel: number | null;
  sexo: number | null;
  vegetariano: boolean;
  frecuencia_entrenamiento: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://sportplanner-backend-production-2053.up.railway.app';

  constructor(private http: HttpClient) {}

  // ======================================================
  // 🔹 Autenticación y registro
  // ======================================================

  registerUser(user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/usuarios/`, user, { headers });
  }

  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
      tap((resp: any) => {
        if (resp.token) {
          localStorage.setItem('token', resp.token);
        }
      })
    );
  }

  registerFullUser(data: RegistroUsuario): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/api/register_full_user/`, data, { headers }).pipe(
      tap((resp: any) => {
        if (resp.token) {
          localStorage.setItem('token', resp.token);
        }
      })
    );
  }

  // ======================================================
  // 🔹 Headers con token
  // ======================================================

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Token ${token}` } : {})
    });
  }

  // ======================================================
  // 🔹 Usuario y perfil
  // ======================================================

  getUserById(id: string | number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/api/usuarios/${id}/`, { headers });
  }

  getPerfil(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/api/perfil/`, { headers });
  }

  guardarPerfil(perfil: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const perfilData = { ...perfil };

    if (!perfil.id) {
      delete perfilData.id;
      return this.http.post(`${this.apiUrl}/api/perfil/`, perfilData, { headers });
    } else {
      return this.http.put(`${this.apiUrl}/api/perfil/${perfil.id}/`, perfilData, { headers });
    }
  }

  // ======================================================
  // 🔹 Datos base (deportes, niveles, sexos)
  // ======================================================

  getDeportes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/deportes/`);
  }

  getNiveles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/nivel/`);
  }

  getSexos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/sexo/`);
  }

  // ======================================================
  // 🔹 Entrenamientos / Ejercicios
  // ======================================================

  getEntrenamientosRecomendados(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/api/ejercicios/`, { headers });
  }

  // ======================================================
  // 🔹 Planes de entrenamiento del usuario
  // ======================================================

  getPlanesUsuario(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/api/planes_usuario/`, { headers });
  }

  crearPlanUsuario(plan: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/api/planes_usuario/`, plan, { headers });
  }

  agregarEjercicioAPlan(planId: number, ejercicioId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/api/planes_usuario/${planId}/agregar_ejercicio/`,
      { ejercicio_id: ejercicioId },
      { headers }
    );
  }

  getEjerciciosDePlan(planId: number) {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/api/planes_usuario/${planId}/detalles/`, { headers });
  }

  marcarPlanComoCompletado(planUsuarioId: number) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/api/planes_usuario/${planUsuarioId}/completar/`, {}, { headers });
  }
}




