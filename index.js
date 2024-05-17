const express = require("express");
const path = require("path");
const multer = require("multer");
const session = require("express-session");

const processImage = require("./middleware/imageProcessing");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const extName = path.extname(file.originalname); 
      cb(null, file.fieldname + '-' + uniqueSuffix + extName)
    }
})
  
const upload = multer({ storage: storage })

const app = express();

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'keyboard dog', resave: false, saveUninitialized: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/display', processImage, (req, res) => {
    res.render("display", { participants: req.session.participants, billImage: req.session.billImage, processedImage: req.session.processedImage});
});

app.post('/', upload.single('billImage'), (req, res) => {
    req.session.participants = JSON.parse(req.body.participants);
    req.session.billImage = path.join(...req.file.path.split("\\").slice(1, req.file.path.split("\\").length));
    res.redirect("/display");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
    }
);

// add the processed image also to the /display page
// handle some of the errors and make it more navigable
// figure out the OCR part