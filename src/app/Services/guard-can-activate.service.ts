import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CheckTokenService } from './check-token.service';

@Injectable({
  providedIn: 'root'
})
export class GuardCanActivateService {

  constructor(private check: CheckTokenService, private router: Router) { }

    canActivate() {
        // If the user is not logged in we'll send them back to the home page
        if (!this.check.getSession()) {
            this.router.navigateByUrl("/login")
            return false;
        }
        return true;
    }
}
