const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const crypto = require('crypto');

const storageTypes = {
  s3: multerS3({
    s3: new aws.S3(),
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if(err) callback(err);
        
        const fileName = `${hash.toString('hex')}-${file.originalname}`;
        callback(null, fileName);
      });
    }
  })
}
module.exports = {
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif'
    ];

    if(allowedMimes.includes(file.mimetype)){
      callback(null, true);
      console.log('VAI PRA PUTA QUE PARIU')
    }else{
      callback(new Error('Invalid file type.'));
      console.log('VAI SE FODER')
    }
  }
}