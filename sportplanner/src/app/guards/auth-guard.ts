import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    // Si NO hay token → enviamos al login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
