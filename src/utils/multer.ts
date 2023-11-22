import { NextFunction, Request, Response } from 'express';
import multer, { MulterError } from 'multer';
import sharp from 'sharp';
import { bucket } from './firebase/firebase.init';

const limits : any = {
    fileSize: 1024 * 1024
}

const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//     destination: __dirname + '/../public/prodcut/uploads/', // Specify the directory where you want to save the files
//     filename: (req : Request, file : Express.Multer.File, cb) => {
//       const fileName = `${Date.now()}_${file.originalname}`;
//       cb(null, fileName);
//     },
//   });

interface CustomRequest extends Request{
  filePath : string;
}
  

const fileFilter = (req : Request, file : Express.Multer.File, cb : any) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|WEBP|webp)$/)) {
      return cb(
        new Error("Not an image! Please upload only images"),
        false
      );
    }
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  };

export const singleFile = (name : string) =>  (req  : CustomRequest, res : Response, next : NextFunction) => {
    const upload = multer({
        storage,
        limits,
        fileFilter
      }).single(name);
    
      upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next({code : 500, message : "Can not upload more than 1 image"});
          }
        }

        if (!req.file) {
          return next({code : 400, message : "No file uploaded."});
        }

        req.file.buffer = await sharp(req.file.buffer).webp({quality : 60}).toBuffer();

        req.file.mimetype = "image/webp";

        if (err) return next({code : 400, message : err.message});

        next();
        
      });
}

/**
 * Upload any number of images with any name
 */
export const anyMulter = () => (req: Request, res: Response, next: NextFunction) => {
    console.log(req);
    const upload = multer({
      storage,
      limits,
      fileFilter,
    }).any();
  
    upload(req, res, (err: any) => {
      if (err) return next({code : 500, message : err.message});
      next();
    });
  };