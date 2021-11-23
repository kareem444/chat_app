import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const uploadMessageImageOptions = {
    storage: diskStorage({
        destination: './assets/images/messages',
        filename: (req, file, callback) => {
            const name = file.originalname.split('.')[0].replace(/\s/g, "-");
            const fileExtName = extname(file.originalname);
            callback(null, `${name}-${uuidv4()}${fileExtName}`);
        }
    }),
    fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
    }
}

export const uploadProfileImageOptions = {
    storage: diskStorage({
        destination: './assets/images/profile',
        filename: (req, file, callback) => {
            const name = file.originalname.split('.')[0].replace(/\s/g, "-");
            const fileExtName = extname(file.originalname);
            callback(null, `${name}-${uuidv4()}${fileExtName}`);
        }
    }),
    fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
    }
}