import { NextFunction, Request, Response } from 'express';
import multer, { MulterError } from 'multer';
const limits : any = {
    fileSize: 1024 * 1024
}

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
    destination: __dirname + '/../public/prodcut/uploads/', // Specify the directory where you want to save the files
    filename: (req : Request, file : Express.Multer.File, cb) => {
      const fileName = `${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    },
  });
  

const fileFilter = (req : Request, file : Express.Multer.File, cb : any) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|WEBP|webp)$/)) {
    //   req.fileValidationError = 'Only image files are allowed!';
      return cb(
        // new AppError('Not an image! Please upload only images', 400),
        new Error("Not an image! Please upload only images"),
        false
      );
    }
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  };

export const singleFile = (name : string) =>  (req  : Request, res : Response, next : NextFunction) => {
    const upload = multer({
        storage,
        limits,
        fileFilter
      }).single(name);
    
      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next({code : 500, message : "Can not upload more than 1 image"});
          }
        }
    
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