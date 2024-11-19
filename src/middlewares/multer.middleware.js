import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/Users/raghupersonal/Desktop/code/NewPJ/public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
     storage
    });

