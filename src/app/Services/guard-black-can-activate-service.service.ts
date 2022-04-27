import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GuardBlackCanActivateServiceService {

  constructor(private router: Router) { }

  canActivate() {
      if (!environment.blacktoken) {
          this.router.navigateByUrl("/login")
          return false;
      }
      return true;
  }
}
