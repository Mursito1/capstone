import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  email: string;
  password: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://sportplanner-backend-production-2053.up.railway.app'; // protocolo incluido

  constructor(private http: HttpClient) {}

  // Registro de usuario
  registerUser(user: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.apiUrl}/usuarios/`, user, { headers });
}

}
