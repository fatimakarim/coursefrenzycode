import { Component, OnInit } from '@angular/core';
import {Config} from '../../Config';
import {GlobalService} from '../../global.service';
import {SimpleGlobal} from 'ng2-simple-global';
import {AddCartDialogComponent} from "../../cart-dialog/add-cart-dialog.component";
import swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from "@angular/material";
import {CoursesService} from "../../course/courses.service";
import {RecommendedCoursesComponent} from "../recommended-courses/recommended-courses.component";
import {BuyNowService} from "../../BuyNow.service";
import {PagerService} from "../../paginator.service";

// import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';

declare const $: any;

@Component({
  selector: 'app-recently-viewed-courses',
  templateUrl: './recently-viewed-courses.component.html',
  styleUrls: ['../../popular-courses/popular-courses.component.css']
})
export class RecentlyViewedCoursesComponent implements OnInit {
  pager: any = {};

  public Courses: any=[];
  public ImageUrl = Config.ImageUrl;
  Logedin: string;
  public GlobalWishListCourses: any;
  public showrecent: boolean;
  private enrolled: any;
  public slideConfig;

  constructor(private global: GlobalService, private nav: Router,private pagerService: PagerService,
              public dialog: MatDialog, private obj: CoursesService,private buyNowService: BuyNowService) {

    // config.max = 5;
    // config.readonly = true;
    this.global.caseNumber$.subscribe(
      data => {
        this.Logedin = data;
      });

    this.global.showRecent$.subscribe(
      data => {
        this.showrecent = data;
      });

    this.global.GlobalWishListCourses$.subscribe(
      data => {
        if (data.length===0){
          this.GlobalWishListCourses = [];
        }else {
          this.GlobalWishListCourses = data;
        }
      });


  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.obj.get_recent_cources(page).subscribe(response => {
      if(response.hasOwnProperty("status")){
        this.Courses = [];
        this.showrecent = false;
        this.global.setShowRecent(false);
      }else {
        this.Courses = response;
        this.pager = this.pagerService.getPager(this.Courses['totalItems'], page,20);
        this.showrecent = true;
        this.global.setShowRecent(true);
      }
    });
   
  }
  ngOnInit() {
this.setPage(1);
  }
  buyNowClick(index, course_id): void {
    this.buyNowService.buyNow(index, course_id,this.Logedin)
  }

  openDialog2(index, course_id): void {
    if (this.Logedin === '1') {
      const dialogRef = this.dialog.open(AddCartDialogComponent, {
        width: '500px',
        data: { course_id: course_id,
          // CourseDetail: this.Courses
        }
      });
    } else {
      RecentlyViewedCoursesComponent.Authenticat();
      this.nav.navigate(['login']);
    }
  }


  onclick(index, course_id) {
    if (this.Logedin === '1') {
      this.obj.add_wishlist(course_id).subscribe(
        data => {
          // console.log(data[0]['json'].json());
          if(data[0]['json'].json().hasOwnProperty("status")) {
            RecentlyViewedCoursesComponent.AlreadyInWishlistError();
          }
          else {
            this.GlobalWishListCourses.push(data[0]['json'].json());
            this.global.getGolbalWishListCourses(this.GlobalWishListCourses);
            RecentlyViewedCoursesComponent.wishlistSuccess();
          }
        },
        error => {
          // console.log(error);
        }
      );
    }
    else {
      RecentlyViewedCoursesComponent.Authenticat();
      this.nav.navigate(['login']);
    }
  }

  enrollCourse(index, course_id): void {
    if (this.Logedin === '1') {
      this.obj.enroll_free_course(course_id).subscribe(
        data => {
          this.enrolled = data[0]['json'].json();
          if(this.enrolled.status===false) {
            RecommendedCoursesComponent.EnrollmentError(this.enrolled.message);
          }
          else {
            RecommendedCoursesComponent.EnrollmentSuccess();
          }
        },
        error => {
          // console.log(error);
        }
      );
    }
    else {
      RecommendedCoursesComponent.Authenticat();
      this.nav.navigate(['login']);
    }
  }
  static EnrollmentError(message) {
    swal({
      type: 'error',
      title: 'Oops! <br> ' + message,
      showConfirmButton: true,
      width: '512px',
    })
  }
  static EnrollmentSuccess() {
    swal({
      type: 'success',
      title: 'Success! <br> Successfuly Purchased.',
      showConfirmButton: false,
      width: '512px',
      timer: 3000,
    });
  }


  static AlreadyInWishlistError() {
    swal({
      type: 'warning',
      title: 'Oops! <br> This course already exists in your wishlist!',
      showConfirmButton: false,
      width: '512px',
      timer: 2500
    })
  }

  static wishlistSuccess() {
    swal({
      type: 'success',
      title: 'Success! <br> Successfuly added to wishlist.',
      showConfirmButton: false,
      width: '512px',
      timer: 2000,
      position: 'top-end'
    });
  }


  static Authenticat() {
    swal({
      type: 'error',
      title: 'Authentication Required <br> Please Login or Signup first',
      showConfirmButton: false,
      width: '512px',
      timer: 1500
    });
  }


}
