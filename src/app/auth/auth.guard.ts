import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
//Gestion de l'autorisation de voir une page
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router){}

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
            
            //Vérification de l'état de connexion
            const isAuth = this.authService.getIsAuth();

            if(!isAuth)
            {
                //Redirection si non autorisé
                this.router.navigate(['/auth/login']);
            }
        
            return isAuth;
    }
}