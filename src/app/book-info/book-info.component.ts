import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from '../http.service';
import { review } from '../classes/review';
import { book } from '../classes/book';

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.css']
})
export class BookInfoComponent implements OnInit {
  myBook: book;
  reviews: review[];
  i: number;
  activity: boolean = true;
  nehal:string = "neahl"

  constructor(private http: HttpService, private route: ActivatedRoute) {
  }

  ngOnInit() { //as2ale philooooooo
    this.myBook = this.route.snapshot.data['bookData'];
    if(this.myBook){
      this.http.getBookReviews().subscribe((data:review[]) => this.reviews = data);
    }

   // this.http.getBook(+this.route.snapshot.paramMap.get('id')).subscribe((data:book) => this.myBook = data);
    //this.http.getBookReviews().subscribe((data:review[]) => this.reviews = data);
  }
}
  

