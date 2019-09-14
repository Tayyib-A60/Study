import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from 'src/app/models/Course.model';
import { Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StuffService } from 'src/app/services/stuff.service';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.scss']
})
export class CourseItemComponent implements OnInit, OnDestroy {

  public course: Course;
  videos: [{title: string, url: string }];
  safeUrls: any [] = [];
  public loading: boolean;
  public userId: string;
  public part: number;

  private partSub: Subscription;
 
  constructor(private state: StateService,
              private router: Router,
              private route: ActivatedRoute,
              private stuffService: StuffService,
              private auth: AuthService,
              private _sanitizer: DomSanitizer) {
                // this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(videoURL);
               }

  ngOnInit() {
    this.loading = true;
    this.state.mode$.next('single-thing');
    this.userId = this.auth.userId ? this.auth.userId : 'userID40282382';
    this.route.params.subscribe(
      (params: Params) => {
        this.stuffService.getThingById(params.id).then(
          (course: Course) => {
            console.log(course);
            let videoArray = JSON.stringify(course.videos);
            videoArray = videoArray.substr(1,videoArray.length-2);
            this.videos = JSON.parse(videoArray);
            this.videos.forEach(video => {
              let url = video.url.replace('watch?v=', 'embed/');
              this.safeUrls.push(this._sanitizer.bypassSecurityTrustResourceUrl(url));
            });
            
            this.loading = false;
            this.course = course;
          }
        );
      }
    );
    this.partSub = this.state.part$.subscribe(
      (part) => {
        this.part = part;
        if (part >= 3) {
          this.userId = this.auth.userId;
        }
      }
    );
  }

  onGoBack() {
    if (this.part === 1) {
      this.router.navigate(['/part-one/all-stuff']);
    } else if (this.part === 3) {
      this.router.navigate(['/part-three/all-stuff']);
    } else if (this.part === 4) {
      this.router.navigate(['/part-four/all-stuff']);
    }
  }

  onModify() {
    switch (this.part) {
      case 1:
      case 2:
        this.router.navigate(['/part-one/modify-thing/' + this.course._id]);
        break;
      case 3:
        this.router.navigate(['/part-three/modify-thing/' + this.course._id]);
        break;
      case 4:
        this.router.navigate(['/part-four/modify-thing/' + this.course._id]);
        break;
    }
  }

  onDelete() {
    if(window.confirm('Are u sure you want to delete the course?')) {
      this.loading = true;
      this.stuffService.deleteThing(this.course._id).then(
        () => {
          this.loading = false;
          switch (this.part) {
            case 1:
            case 2:
              this.router.navigate(['/part-one/all-stuff']);
              break;
            case 3:
              this.router.navigate(['/part-three/all-stuff']);
              break;
            case 4:
              this.router.navigate(['/part-four/all-stuff']);
              break;
          }
        }
      );
    }
  }

  ngOnDestroy() {
    this.partSub.unsubscribe();
  }

}
