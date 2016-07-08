 var config = require('ez-config-loader')('config/ibuildweb');
 var fileUpload = require('express-fileupload');

 module.exports = function(server) {
     server.use(fileUpload());
     server.post('/upload', function(req, res) {
         var _file;

         console.log('---', req.body);
         if (!req.files) {
             res.send('No files were uploaded.');
             return;
         }

         _file = req.files.file;
         _file.mv('app/' + config.img_path + 'maps/filename.jpg', function(err) {
             if (err) {
                 res.status(500).send(err);
             } else {
                 res.send('File uploaded!');
             }
         });
     });
 };
 // var multer = require('multer');
 /*     var storage = multer.diskStorage({
          destination: function(req, file, cb) {

              cb(null, 'app/' + config.img_path + 'maps')
          },
          filename: function(req, file, cb) {
          console.log('---', req.body);
              cb(null, file.originalname + '-' + Date.now() + '.jpg')
          }
      });
      var upload = multer({ storage: storage });
      server.post('/upload', upload.single('file'), function(req, res, next) {
          // req.body contains the text fields
          console.log(req.body);
          res.send('File uploaded!');
      });*/
