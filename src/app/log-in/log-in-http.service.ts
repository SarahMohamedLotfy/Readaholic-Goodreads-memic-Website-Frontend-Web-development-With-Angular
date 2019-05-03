import { AppConstants } from './../classes/appconstant';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

/**An http service for the requests of logging in and out requests */
@Injectable({
    providedIn: 'root'
  })

  export class LogInHttpService {

  url:string=AppConstants.baseURL;
 //url:string='http://0ea47257.ngrok.io';
    /**Constructor that takes HttpClient */
    constructor(private http:HttpClient) {}


    /**Sends a request to the server with the email and password to checks if they're correct */
 login(email:string,password:string): Observable<any>
 {
   return this.http.post(this.url+'/api/login',{email,password}) ;
 }


/**Sends a request to server with the variables that user entered to sign up a new user */
 signUp(email:string,password:string,password_confirmation:string,name:string,gender:string,birthday:Date,country:string,city:string): Observable<any>
 {
   return this.http.post(this.url+'/api/signup',{email,password,password_confirmation,name,gender,birthday,country,city}) ;
 }
/**Loggs out the user from the website */
 logOut():Observable<any>{
    return this.http.delete(this.url+'/api/logout');
  }

  resetPass(email:string): Observable<any> {
        
    return this.http.post<any>(this.url+'/api/forgotpassword',{email});
    
   }

   verify(): Observable<any>
   {
       return this.http.get(this.url+'/api/verify');
   }

   
   getBookByGenre(genre:string): Observable<any> {
        
    return this.http.get<any>(this.url+'/api/books/genre?genreName='+genre);
    
   }
  
  }
  
