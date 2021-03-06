import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { review } from '../classes/review';
import { book } from '../classes/book';
import { userBookInfo } from '../classes/userBookInfo';
import { BookService } from './book.service';
import { ShelfService } from '../shared/dropdown/shelf.service';
import { SharedService } from '../shared.service';
import { userInfo } from 'os';

/**component to show details of a specific book */
@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.css']
})
export class BookInfoComponent implements OnInit {
  /**store information of the selected book */
  myBook: book;

  /**reviews array of the selectec book */
  reviews: review[];


  /**stores user related book info */
  userInfo: userBookInfo = {
    id: -1,
    rating: 0,
    shelf_name: 3,
    body: ""
  };

  /**true if user mode false if guest mode */
  isUser: boolean;

  /**error msg */
  errMsg: string;

  /**shelves array */
  shelves: string[] = ['Read', 'Currently Reading', 'Want To Read'];

  /**@ignore */
  reviewId = -1;
  /**@ignore */
  reviewShelf = 0;
  /**@ignore */
  reviewBody = "";
  /**@ignore */
  reviewRating = 0;
  /**@ignore */
  shelfName: string = "";
  /**@ignore */
  modelShelf: string = "read";


  /**
   * constructor that takes in the passes parameters 
   * @param {BookService} service injected book service instance
   * @param {ActivatedRoute} route activated route instance
   * @param {Router} router router inastance to route by code
   * @param {shelfService} shelf http service
   * @param {shelfService} a shared service to communicate between bookInfoComponent, starComponent, dropdwonComponent
   */
  constructor(private service: BookService, private route: ActivatedRoute, private router: Router, private shelfService: ShelfService, private sharedService: SharedService, ) {
    
    this.sharedService.currentShelf.subscribe(data => {
      if (data.key != -1 && data.value != -1 && this.myBook) {
        if (data.key == this.myBook.id) {
          this.reviewShelf = data.value;
          if (this.reviewShelf == 3) {
            this.reviewBody = "";
            this.reviewId = -1;
            this.reviewRating = 0;

            this.userInfo.id = -1;
            this.userInfo.body = "";
            this.userInfo.rating = 0;
            this.userInfo.shelf_name = 3;
          } else {
            this.shelfName = this.shelves[this.reviewShelf];
            this.userInfo.shelf_name = this.reviewShelf;
          }
        }
      }
    });
  }

  /**checks if a user has logged in to shift between guest mode and user mode
   * gets the selected book information
    */
  ngOnInit() {
    if (localStorage.getItem('token') == null) {
      this.isUser = false;
    }
    else {
      this.isUser = true;
    }

    this.getBookInfo();
    if(this.isUser) {
      this.getUserInfo();
      this.getBookReviews();
    }
  }

  /**get the selected book information */
  getBookInfo() {
    this.service.getBook(+this.route.snapshot.paramMap.get('id'))
      .subscribe((data) => {
        this.myBook = data.pages[0];

        if (Math.floor(this.myBook.ratings_avg) > this.myBook.ratings_avg - 0.5) {
          this.myBook.ratings_avg = Math.floor(this.myBook.ratings_avg);
        }
        else {
          this.myBook.ratings_avg = Math.ceil(this.myBook.ratings_avg);
        }
      }, () => this.router.navigateByUrl("/pageNotfound"));
  }

  /**gets the selected book reviews */
  getBookReviews() {
    this.service.getBookReviews(+this.route.snapshot.paramMap.get('id'))
      .subscribe((data) => {
        this.reviews = data.pages;
      });
  }

  /**gets user related book information */
  getUserInfo() {
    this.shelfService.getUserBookInfo(+this.route.snapshot.paramMap.get('id')).subscribe((data) => {
      this.userInfo = data.pages[0];

      this.reviewId = this.userInfo.id;
      this.reviewBody = this.userInfo.body;
      this.reviewShelf = this.userInfo.shelf_name;
      this.reviewRating = this.userInfo.rating;

      this.shelfName = this.shelves[this.reviewShelf];

    });
  }

  /**checks if there is an input body then calls the book service funstion to create a review */
  review() {
    if (this.reviewBody != "" && this.reviewBody) {
      this.service.createReview(this.myBook.id, this.reviewShelf, this.reviewBody, this.reviewRating)
        .subscribe((data) => {
          this.userInfo.id = data.Review_id;
          this.userInfo.body = data.bodyOfReview
          this.userInfo.rating = data.rate;

          if (data.shelfType == "read") {
            this.userInfo.shelf_name = 0;
            this.reviewShelf = 0;
            this.shelfName = this.shelves[this.reviewShelf];
          } else if (data.shelfType == "currently-reading") {
            this.userInfo.shelf_name = 1;
            this.reviewShelf = 1;
            this.shelfName = this.shelves[this.reviewShelf];
          } else {
            this.userInfo.shelf_name = 2;
            this.reviewShelf = 2;
            this.shelfName = this.shelves[this.reviewShelf];
          }

          this.reviewId = this.userInfo.id;
          this.reviewBody = this.userInfo.body;
          this.reviewRating = this.userInfo.rating;

          this.sharedService.changeShelf(this.myBook.id, this.reviewShelf);

          document.getElementById("closebtn").click();
          this.errMsg = "";
        });
    }
    else {
      this.errMsg = "You must enter a review";
    }
  }

  /** checks if the user has a review on this book then deletes it */
  deleteReview() {
    if (this.isUser && this.reviewId != -1) {
      this.service.deleteReview(this.reviewId).subscribe((data) => {
        console.log(data);
        this.reviewId = -1;
        this.reviewBody = "";
        this.reviewRating = 0;

        this.userInfo.id = -1;
        this.userInfo.body = "";
        //this.userInfo.shelf_name = 3;
        this.userInfo.rating = 0;

        //this.sharedService.changeShelf(this.myBook.id, 3);

        document.getElementById("closebtn").click();
        this.errMsg = "";
      });
    }
    else {
      this.errMsg = "You don't have a review on this book"
    }


  }

  /**
   * opens the review model when the user rates a book
   * @param {number} rate The output rate from the star component
   */
  open(rate: number) {

    if (rate <= 5) {
      this.reviewRating = rate;
      this.userInfo.rating = rate;
    }
    else {
      document.getElementById("openModalButton").click();
      return;
    }
    if (this.userInfo.id == -1) {
      /* this.userInfo.shelf_name = 0;
       this.shelfName = "Read";*/
      document.getElementById("openModalButton").click();
    }
  }

  /**function to toggle a dropdown menu */
  openShelves() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  /**filters the dropdown menu when user enters a filter */
  filterFunction() {
    var input, filter, a, i, text;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();

    var div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      text = a[i].textContent || a[i].innerText;
      if (text.toUpperCase().indexOf(filter) == 0) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }
}
