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
  private apiUrl = 'https://sportplanner-backend-production-2053.up.railway.app'; // ✅ tu API real

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

  // 🔹 Obtener usuario por ID (para mostrar nombre en "Inicio")
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/list/${id}/`);
  }

  // 🔹 Obtener token si lo usas (ej. para endpoints protegidos)
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Token ${token}` } : {}) // 👈 adapta según tu backend (Token o Bearer)
    });
  }
}

