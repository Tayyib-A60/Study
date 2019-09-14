const Course = require('../models/course');
const fs = require('fs');

exports.createCourse = (req, res, next) => {
    const courseToCreate = JSON.parse(req.body.course);
    
    const url = req.protocol + '://' + req.get('host');
    const course = new Course({
        title: courseToCreate.title,
        description: courseToCreate.description,
        content: courseToCreate.content,
        imageUrl: url + '/images/' + req.file.filename,
        userId: courseToCreate.userId,
        videos: [courseToCreate.videos]
    });
    course.save().then(
        () => {
            res.status(201).json({
                message: 'Product created!'
            });
        }
    ).catch(err => {
        res.status(400).json({
            error: err.message
        });
    });
 };

 exports.getCourse = (req,res,next) => {
    Course.findOne({
        _id: req.params.id
    }).then(
        course => {
            let videos = [];
            console.log(course);
            
            // course.videos.forEach(videoObj => {
            //     videoObj.findOne({
            //         _id: videoObj._id
            //     }).then(res => videos.push())
            // });
            // course.videos = [...videos];
            res.status(200).json(course);
        }
    ).catch(
        err => {
            res.status(400).json({
                error: err
            });
        }
    );
};
exports.getVideos = (req, res, next) => {
    Course.find({"videos._id": '5d7b6570f4b6f81c0c443c12' })
    .then(video => {
        console.log(video);
        res.status(200).json(video);
    }).catch(
        err => {
            res.status(400).json({
                error: err.message
            });
        }
    );
}

exports.getCourses = (req, res, next) => {
    Course.find().then(
        courses => {
          res.status(200).json(courses);
        }
      ).catch(
          err => {
              res.status(400).json({
                  error: err
              });
          }
      );
  };

  exports.updateCourse = (req, res, next) => {
      let courseToUpdate = new Course({ _id: req.params.id });
      if(req.file) {
        const course = JSON.parse(req.body.course);
        const url = req.protocol + '://' + req.get('host');
        courseToUpdate = {
            _id: req.params.id,
            title: course.title,
            description: course.description,
            content: course.content,
            imageUrl: url + '/images/' + req.file.filename,
            userId: course.userId,
            videos: [course.videos]
        };
      } else {
          courseToUpdate = {
              _id: req.params.id,
              title: req.body.title,
              description: req.body.description,
              content: req.body.content,
              imageUrl: req.body.imageUrl,
              userId: req.body.userId,
              videos: [req.body.videos]
          };
      }
    Course.updateOne({ _id: req.params.id }, courseToUpdate).then(
        () => {
            res.status(201).json({
                message: 'Course updated!'
            });
        }
    ).catch(err => {
        res.status(400).json({
            error: err
        });
    })
 };

 exports.deleteCourse = (req, res, next) => {
    Course.findOne({ _id: req.params.id }).then(
        course => {
            const filename = course.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Course.deleteOne({ _id: req.params.id })
                .then(
                    () => res.status(200).json({
                        message: 'Course deleted'
                    })
                ).catch(
                    err => res.status(400).json(
                        { error: err }
                    )
                );
            });
        }
    );
};