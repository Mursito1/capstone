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

  // 🔹 Registro de usuario simple (sin perfil)
  registerUser(user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/usuarios/`, user, { headers });
  }

  // 🔹 Login
  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
      tap((resp: any) => {
        if (resp.token) {
          localStorage.setItem('token', resp.token); // Guardar token automáticamente
        }
      })
    );
  }

  // 🔹 Registro completo con perfil y token automático
  registerFullUser(data: RegistroUsuario): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/api/register_full_user/`, data, { headers }).pipe(
      tap((resp: any) => {
        if (resp.token) {
          localStorage.setItem('token', resp.token); // Guardar token automáticamente
        }
      })
    );
  }

  // 🔹 Obtener usuario por ID
  getUserById(id: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/usuarios/${id}/`);
  }

  // 🔹 Obtener perfil del usuario logueado
  getPerfil(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/api/perfil/`, { headers });
  }

  // 🔹 Guardar o actualizar perfil
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

  // 🔹 Headers con token
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Token ${token}` } : {})
    });
  }

  // 🔹 Obtener deportes, niveles y sexos
  getDeportes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/deportes/`);
  }

  getNiveles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/nivel/`);
  }

  getSexos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/sexo/`);
  }

  getEntrenamientosRecomendados(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/api/ejercicios/`, { headers });
  }
}



