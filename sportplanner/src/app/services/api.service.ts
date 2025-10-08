import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  email: string;
  password: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://sportplanner-backend-production-2053.up.railway.app';

  constructor(private http: HttpClient) {}

  // 🔹 Registro de usuario
  registerUser(user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/usuarios/`, user, { headers });
  }

  // 🔹 Inicio de sesión
  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, credentials);
  }

  // 🔹 Obtener usuario por ID
  getUserById(id: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}/`);
  }

  // 🔹 Obtener perfil directamente por ID
  getPerfilById(id: string | number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/api/perfil/${id}/`, { headers });
  }

  // 🔹 Guardar o actualizar perfil
  guardarPerfil(perfil: any): Observable<any> {
    const headers = this.getAuthHeaders();
    if (perfil.id) {
      return this.http.put(`${this.apiUrl}/api/perfil/${perfil.id}/`, perfil, { headers });
    } else {
      return this.http.post(`${this.apiUrl}/api/perfil/`, perfil, { headers });
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

  // 🔹 Fallback: traer todos los perfiles
  getAllPerfiles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/perfil/`);
  }
}


