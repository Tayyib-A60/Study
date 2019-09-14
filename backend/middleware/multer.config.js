const multer = require('multer');

const File_Extensions = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = File_Extensions[file.mimetype];
        callback(null, `${name}${Date.now()}.${extension}`); 
    }
});

module.exports = multer({ storage }).single('image');