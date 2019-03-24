import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class HomeService {



  constructor(private http:HttpClient) {}



   getUpdates():Observable<any>{
return this.http.get("http://localhost:3000/updates")
.pipe(
      retry(3), // retry a failed request up to 3 times
    catchError(this.handleError) // then handle the error

    );
   }
  
   private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
 
  logOut():Observable<any>{
    return this.http.get('http://localhost:3000/logOut');
  }
}