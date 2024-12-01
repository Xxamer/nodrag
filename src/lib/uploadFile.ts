import multer from "multer";
export const uploadFile = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "data");
        },
        filename: function (req, file, cb) {
            const fileExtension = file.originalname.split(".").pop();
            const fileName = `${Date.now()}.${fileExtension}`;
            cb(null, fileName);
        },
    })
})