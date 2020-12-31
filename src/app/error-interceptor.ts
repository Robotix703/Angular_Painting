import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './error/error.component';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    //Interception de tout les messages HTTP
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        
        //Relachement de la requête
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {

                let errorMessage = "Une erreur inconnu est arrivé";

                if(error.error.message){
                    errorMessage = error.error.message;
                }

                //Affichage
                this.dialog.open(ErrorComponent, {data: {message: errorMessage}});

                //Renvoie de l'erreur
                return throwError(error);
            })
        );
    };
}