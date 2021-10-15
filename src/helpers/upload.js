const multer = require('multer')
const path = require('path')

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'assets', 'images'))
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.')[1]
    const date = new Date()
    cb(null, `${date.getTime()}.${ext}`)
  }
})

module.exports = multer({ storage, limits: { fileSize: '1MB' }, fileFilter: imageFilter  })
