import { RatingModule } from 'ng2-rating';
import { book } from './../classes/book';

import { Component, OnInit, NgModule } from '@angular/core';
import { updates } from '../classes/updates';

//import { actor } from '../classes/actor';
//import { action } from '../classes/action';


import { ActionSequence } from 'protractor';
import { profile } from '../classes/profile';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LogInComponent } from '../log-in/log-in.component';
import { DropdownComponent } from '../shared/dropdown/dropdown.component';
import { StarComponent } from '../shared/star/star.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { HomeService } from './home.service';
import { HttpService } from '../http.service';
import { EILSEQ } from 'constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
/**
 *main home of readholic
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ]})
@Component({
  /**
 *selector of home
 */
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

 /**
 * Home is where updates are viewed
 */
export class HomeComponent implements OnInit {
  /**
 *array of updates 
 */
  updatess:updates[];
  
   error: any;
  
 
 /**
 *we pass an object of  homeservice to the constructor 
 */
   constructor(private httpser:HomeService,private route: ActivatedRoute,private router: Router,private modalService: NgbModal) {
    
    }
 /**
 * get data on loading home
 */
   ngOnInit(){
     setTimeout(()=>{this.httpser.getUpdates().subscribe(
         data =>{
           this.updatess=data ;
           console.log(data);
           this.loadData();

        }, error => this.error = error);},1000)

     }
    /**
 * function loadData is for checking type of updates and managing its html view 
 */
     loadData(){
       var i;
  
       for(i=0;i<this.updatess.length;i++){
         /**
 * update type 0 means user rated or reviewed a book  
 */
     
    
    if ( this.updatess[i].update_type === 0 && !(this.updatess[i].body)){
  
    this.updatess[i].actionText=" rated a book " ;
  
    } 
    else if ( this.updatess[i].update_type === 0 ){
      this.updatess[i].actionText=" reviewed a book " ;
     
     }     /**
    * update type 1 and shelf number 1  means user read a book  
    */
    else if ( this.updatess[i].update_type === 1 && this.updatess[i].shelf_type === 0){
    this.updatess[i].actionText=" read a book " ;
   
    }    /**
    * update type 1 annd shelf number 2  means user is currently reading a book  
    */
   else if (  this.updatess[i].update_type === 1 && this.updatess[i].shelf_type === 1){
        this.updatess[i].actionText=" is currently reading a book " ;
        
      } /**
      * update type 1 annd shelf number 3  means user wants to read a book  
      */
     else if (  this.updatess[i].update_type === 1 && this.updatess[i].shelf_type === 2){
         
          this.updatess[i].actionText=" wants to read a book " ;
    
        } /**
        * update type 2 means user followed someone  
        */
    else  if ( this.updatess[i].update_type === 2){
         
        this.updatess[i].actionText=" started following  : " ;
      } /**
      * update type 3 means user liked a review
      */
     else if (  this.updatess[i].update_type === 3){
       
          this.updatess[i].actionText=" liked a review  " ;

        } /**
        * update type 4 means user commented on a review
        */
      else  if (  this.updatess[i].update_type === 4){
          
            this.updatess[i].actionText=" commented on a review " ;
      
        }
        else{  this.updatess[i].actionText=" " ;}
       // console.log(this.updatess[i].actionText);
       }
          }
     /**
        * function addfollowing is trigeered when user follow someone
        */
    addFollowing(nb){
      this.httpser.addFollowing(nb).subscribe(
        data  => {
        console.log("POST Request is successful ", data); 
        this.httpser.getUpdates().subscribe(
          data =>{
            this.updatess=data ;
            console.log(data);
            this.loadData();
 
         }, error => this.error = error);
        

        },
        error  => {
        
        console.log("Error", error);
        
        }
        
        );}
        /**
        * function addbooktoshelf is trigeered when user add a book to a new shelf
        */
        addBook(shelf,book_id){
          this.httpser.addBook(shelf,book_id).subscribe(
            data  => {
              console.log("POST Request is successful ", data);
              },
              error  => {
              
              console.log("Error", error);
              
              }
          )
        }
        /**
        * function  is trigeered when user unfollow someone
        */
        delFollowing(nb){
          this.httpser.unfollow(nb).subscribe((data) =>{
            console.log("delete Request is successful ", data);
            this.httpser.getUpdates().subscribe(
              data =>{
                this.updatess=data ;
                console.log(data);
                this.loadData();
     
             }, error => this.error = error);
            
          
          },
          error  => {
          
          console.log("Error", error);
          
          }
                 )
        }
}
