import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination called");
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    console.log("File received:", file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;