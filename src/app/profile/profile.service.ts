import { AppConstants } from './../classes/appconstant';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/** insert the service in the root of the application */
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  /** create http object in the constructor to use httpClient  */
  constructor( private http: HttpClient ) { }
 /** url of localhost */
  url :string=AppConstants.baseURL;
   /** http request to get user profile info  */
  getUserprofile(id: number): Observable<any> {

    return this.http.get<any> ('http://ec2-34-205-32-73.compute-1.amazonaws.com/app/api/showProfile?id='+ id );
  }
/** http request to get authenticated user profile info */
  getAuthUserprofile(): Observable<any> {
    return this.http.get<any> ('http://ec2-34-205-32-73.compute-1.amazonaws.com/app/api/showProfile');
  }

  getUpdatesForuser(id: number):Observable<any>{
    return this.http.get('http://ec2-34-205-32-73.compute-1.amazonaws.com/app'+"/api/updates?user_id="+ id + "&max_updates=" + 15);
       }
  getfollowersforusers(id:number): Observable<any> {
    return this.http.get('http://ec2-34-205-32-73.compute-1.amazonaws.com/app/api/following?id='+ id )
  }

}
