import { Component, OnDestroy, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Thing } from '../../models/Thing.model';
import { StuffService } from '../../services/stuff.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../models/Course.model';

@Component({
  selector: 'app-single-thing',
  templateUrl: './single-thing.component.html',
  styleUrls: ['./single-thing.component.scss']
})
export class SingleThingComponent implements OnInit, OnDestroy {

  public course: Course;
  public loading: boolean;
  public userId: string;
  public part: number;

  private partSub: Subscription;

  constructor(private state: StateService,
              private router: Router,
              private route: ActivatedRoute,
              private stuffService: StuffService,
              private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;
    this.state.mode$.next('single-thing');
    this.userId = this.auth.userId ? this.auth.userId : 'userID40282382';
    this.route.params.subscribe(
      (params: Params) => {
        this.stuffService.getThingById(params.id).then(
          (course: Course) => {
            console.log(course);
            
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
