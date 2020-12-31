import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    if (typeof(control.value) === 'string') {
        return of(null);
      }
    //Récupération du fichier
    const file = control.value as File;
    //Lecteur du fichier
    const fileReader = new FileReader();

    //Création d'un observateur
    const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
        //Attente fin de la lecture
        fileReader.addEventListener("loadend", () => {
            //Validation du type
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);

            //Boucle sur le contenu
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            let isValid = false;
            switch (header) {
                case "89504e47":
                  isValid = true;
                  break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                  isValid = true;
                  break;
                default:
                  isValid = false; // Or you can use the blob.type as fallback
                  break;
            }
            if (isValid) {
                observer.next(null);
            } else {
                observer.next({ invalidMimeType: true });
            }
            observer.complete();
        });
        //Lecture du type
        fileReader.readAsArrayBuffer(file);
    });

    return frObs;
}