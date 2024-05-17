const path = require("path")
const {createWorker} = require("tesseract.js")
const sharp = require("sharp")

async function imageProcessor(input) {
    const processedImage = await sharp(input)
      .grayscale()
      .normalise()
      .sharpen()
      .threshold(140) //fine tune it more
      .toFile(input.replace("uploads", path.join("uploads", "processed")))
}

// const processImage = function (req, res, next) {
//     if (req.session.billImage) {
//         imageProcessor(path.join("public", req.session.billImage))
//         .then(() => {
//             console.log("Image processed successfully")
//             next()
//         })
//         .catch((err) => {
//             console.error(err)
//             res.status(500).send("Error processing image")
//         })
//     }
// }

async function processImage(req, res, next) {
    if (req.session.billImage) {
        try {
            await imageProcessor(path.join("public", req.session.billImage))
            req.session.processedImage = req.session.billImage.replace("uploads", path.join("uploads", "processed"))
            console.log(req.session.processedImage)
            console.log("Image processed successfully")
            const worker = await createWorker()
            const recognizedData = await worker.recognize(path.join("public", req.session.processedImage))
            console.log(recognizedData.data.text)
            // req.session.billText = processedData.data.text
            await worker.terminate()
            next()
        } catch (err) {
            console.error(err)
            res.status(500).send("Error processing image")
        }
    }
}

module.exports = processImage;