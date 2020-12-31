import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

//Permet d'injecter un service dans un autre
@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    //Interception de tout les messages HTTP
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        
        //Token
        const authToken = this.authService.getToken();

        //Ajout du token dans la requête
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer " + authToken)
        });

        //Relachement de la requête
        return next.handle(authRequest);
    };
}