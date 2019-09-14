export class Course {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    content: string;
    userId: string;
    videos: [ {title: string, url: string } ]
  }