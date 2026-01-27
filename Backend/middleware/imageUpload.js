import multer from "multer";

// Configure multer storage 
const storage = multer.memoryStorage();

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
    // Check if the uploaded file is an image by checking the mimetype
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        // If the file is not an image (e.g., PDF, DOCX), reject it with an error
        cb(new Error(`Only image files are allowed for ${file.fieldname}!`), false);
    }
};

// Initialize multer with the defined storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;