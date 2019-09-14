import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { StuffService } from '../../services/stuff.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Thing } from '../../models/Thing.model';
import { mimeType } from '../mime-type.validator';
import { Course } from 'src/app/models/Course.model';

@Component({
  selector: 'app-new-thing-with-upload',
  templateUrl: './new-thing-with-upload.component.html',
  styleUrls: ['./new-thing-with-upload.component.scss']
})
export class NewThingWithUploadComponent implements OnInit {

  public thingForm: FormGroup;
  public courseForm: FormGroup;
  course: Course;
  public loading = false;
  public part: number;
  id: string;
  editMode: boolean = false;
  public userId: string;
  public imagePreview: string;
  public errorMessage: string;

  constructor(private state: StateService,
              private stuffService: StuffService,
              private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService) { }

  ngOnInit() {
    this.state.mode$.next('form');
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
      
    }
    private initForm() {
      let title = '';
      let description = '';
      let content = '';
      let videos = new FormArray([]);

      if(this.editMode) {
        this.stuffService.getThingById(this.id.toString()).then(
          (course: Course) => {
            this.course = course;
            this.imagePreview = course.imageUrl;
            title = this.course.title
            description=  this.course.description;
            content = this.course.content;
            let videoArray = JSON.stringify(course.videos);
            videoArray = videoArray.substr(1,videoArray.length-2);
            let vids = JSON.parse(videoArray);
            if(vids.length > 0) {
                vids.map(v => {
                  videos.push(
                    new FormGroup({
                      'title': new FormControl(v['title'], Validators.required),
                      'url': new FormControl(v['url'], Validators.required)
                    })
                  );
                } 
            }

            this.loading = false;
            this.courseForm = new FormGroup({
              'title': new FormControl(title, Validators.required),
              'imageUrl': new FormControl(course.imageUrl, Validators.required, mimeType),
              'description': new FormControl(description, Validators.required),
              'content': new FormControl(content, Validators.required),
              'videos': videos
            });
            this.userId = this.auth.userId;
        }
      }
        this.courseForm = new FormGroup({
          'title': new FormControl(title, Validators.required),
          'imageUrl': new FormControl(null, Validators.required, mimeType),
          'description': new FormControl(description, Validators.required),
          'content': new FormControl(content, Validators.required),
          'videos': videos
        });
        this.userId = this.auth.userId;
    }

  onAddVideo() {
    (<FormArray>this.courseForm.get('videos')).push(
      new FormGroup({
        'title': new FormControl(null, Validators.required),
        'url': new FormControl(null, Validators.required)
      })
    );
  }
  onDeleteVideo(index: number) {
    (<FormArray>this.courseForm.get('videos')).removeAt(index);
  }
  onSubmit() {
    this.loading = true;
    let course = new Course();
    course = this.courseForm.value;
    course.imageUrl = '';
    course.userId = this.userId;

    if(this.editMode) {
      this.stuffService.modifyThingWithFile(this.id, course, this.courseForm.get('imageUrl').value).then(
        () => {
          this.courseForm.reset();
          this.loading = false;
          this.router.navigate(['/part-four/all-stuff']);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = error.message;
        }
      );
    } else {
      this.stuffService.createNewThingWithFile(course, this.courseForm.get('imageUrl').value).then(
        () => {
          this.courseForm.reset();
          this.loading = false;
          this.router.navigate(['/part-four/all-stuff']);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = error.message;
        }
      );
    }
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.courseForm.get('imageUrl').patchValue(file);
    this.courseForm.get('imageUrl').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      if (this.courseForm.get('imageUrl').valid) {
        this.imagePreview = reader.result;
      } else {
        this.imagePreview = null;
      }
    };
    reader.readAsDataURL(file);
  }
}
