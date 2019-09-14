import { Component, OnDestroy, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { StuffService } from '../../services/stuff.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/Course.model';

@Component({
  selector: 'app-stuff-list',
  templateUrl: './stuff-list.component.html',
  styleUrls: ['./stuff-list.component.scss']
})
export class StuffListComponent implements OnInit, OnDestroy {

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
      this.router.navigate(['/part-four/thing/' + id]);
    }
  }

  ngOnDestroy() {
    this.stuffSub.unsubscribe();
    this.partSub.unsubscribe();
  }

}
