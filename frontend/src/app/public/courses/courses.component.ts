import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from 'src/app/models/Course.model';
import { Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { StuffService } from 'src/app/services/stuff.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {

  public course: Course[] = [];
  public part: number;
  public loading: boolean;

  private stuffSub: Subscription;
  private partSub: Subscription;

  constructor(private state: StateService,
              private stuffService: StuffService,
              private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.state.mode$.next('list');
    this.stuffSub = this.stuffService.stuff$.subscribe(
      (course) => {
        this.course = course;
        this.loading = false;
        console.log(course);
        
      }
      );
      this.partSub = this.state.part$.subscribe(
        (part) => {
        this.part = part;
        console.log('loading parts ',this.loading);
      }
    );
    this.stuffService.getStuff();
  }

  onProductClicked(id: string) {
    if (this.part === 1) {
      this.router.navigate(['/part-one/thing/' + id]);
    } else if (this.part === 3) {
      this.router.navigate(['/part-three/thing/' + id]);
    } else if (this.part === 4) {
      this.router.navigate(['/part-four/course/' + id]);
    }
  }

  ngOnDestroy() {
    this.stuffSub.unsubscribe();
    this.partSub.unsubscribe();
  }

}
