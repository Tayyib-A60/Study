import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartThreeComponent } from './part-three/part-three.component';
import { PartFourComponent } from './part-four/part-four.component';
import { DefaultComponent } from './default/default.component';
import { StuffListComponent } from './part-one/stuff-list/stuff-list.component';
import { SingleThingComponent } from './part-one/single-thing/single-thing.component';
import { LoginComponent } from './part-three/auth/login/login.component';
import { SignupComponent } from './part-three/auth/signup/signup.component';
import { AuthGuard } from './services/auth-guard.service';
import { NewThingWithUploadComponent } from './part-four/new-thing-with-upload/new-thing-with-upload.component';
import { CourseItemComponent } from './public/course-item/course-item.component';
import { CoursesComponent } from './public/courses/courses.component';

const routes: Routes = [
  { path: 'part-three', component: PartThreeComponent,
    children: [
      { path: 'all-stuff', component: StuffListComponent, canActivate: [AuthGuard] },
      { path: 'thing/:id', component: SingleThingComponent, canActivate: [AuthGuard] },
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/signup', component: SignupComponent },
      { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
      { path: '**', redirectTo: 'all-stuff' }
    ]
  },
  { path: 'part-four', component: PartFourComponent,
    children: [
      { path: 'new-thing', component: NewThingWithUploadComponent, canActivate: [AuthGuard] },
      { path: 'all-stuff', component: StuffListComponent, canActivate: [AuthGuard] },
      { path: 'courses', component: CoursesComponent },
      { path: 'course/:id', component: CourseItemComponent },
      { path: 'thing/:id', component: SingleThingComponent, canActivate: [AuthGuard] },
      { path: 'modify-thing/:id', component: NewThingWithUploadComponent, canActivate: [AuthGuard] },
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/signup', component: SignupComponent },
      { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
      { path: '**', redirectTo: 'all-stuff' }
    ]
  },
  // { path: 'default', component: DefaultComponent },
  { path: 'part-four/courses', pathMatch: 'full', component: CoursesComponent },
  { path: '**', redirectTo: 'part-four/courses' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule {}
