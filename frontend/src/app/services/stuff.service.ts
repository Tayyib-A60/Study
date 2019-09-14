import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Thing } from '../models/Thing.model';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models/Course.model';

@Injectable({
  providedIn: 'root'
})
export class StuffService {

  constructor(private http: HttpClient) {}

  private stuff: Course[] = [
    // {
      // _id: '324sdfmoih3',
      // title: 'My thing',
      // description: 'All about my thing',
      // imageUrl: 'https://c.pxhere.com/photos/30/d6/photographer_camera_lens_slr_photography_hands-1079029.jpg!d',
      // price: 4900,
      // userId: 'will'
    // },
    // {
    //   _id: '324sdfmoih4',
    //   title: 'Another thing',
    //   description: 'All about my thing',
    //   imageUrl: 'https://www.publicdomainpictures.net/pictures/10000/velka/1536-1249273362hbHb.jpg',
    //   price: 2600,
    //   userId: 'will'
    // },
  ];
  public stuff$ = new Subject<Course[]>();

  getStuff() {
    this.http.get('http://localhost:3080/api/course').subscribe(
      (stuff: Course[]) => {
        if (stuff) {
          this.stuff = stuff;
          this.emitStuff();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  emitStuff() {
    this.stuff$.next(this.stuff);
  }

  getThingById(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3080/api/course/' + id).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  createNewThing(thing: Thing) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3080/api/course', thing).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  createNewThingWithFile(course: Course, image: File) {
    return new Promise((resolve, reject) => {
      const courseData = new FormData();
      courseData.append('course', JSON.stringify(course));
      courseData.append('image', image, course.title);
      console.log(courseData);
      
      this.http.post('http://localhost:3080/api/course', courseData).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  modifyThing(id: string, thing: Thing) {
    return new Promise((resolve, reject) => {
      this.http.put('http://localhost:3080/api/course/' + id, thing).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  modifyThingWithFile(id: string, course: Course, image: File | string) {
    return new Promise((resolve, reject) => {
      let courseData: Course | FormData;
      if (typeof image === 'string') {
        console.log(image);
        
        course.imageUrl = image;
        courseData = course;
      } else {
        courseData = new FormData();
        courseData.append('course', JSON.stringify(course));
        courseData.append('image', image, course.title);
      }
      this.http.put('http://localhost:3080/api/course/' + id, courseData).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  deleteThing(id: string) {
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3080/api/course/' + id).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
