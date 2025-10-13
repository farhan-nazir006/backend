import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Public/temp')  // cb = callBack funtion
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)  // Save file with filename write by the user
  }
})

export const upload = multer({ storage})