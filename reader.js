// // GPT Prompt prefix => Please extract the Items and their prices, Taxes amount, Total Bill from this paragraph (The currency is rupees)
// // Figure out the best image processing technique to extract the data from the image

const path = require('path');
const { createWorker } = require('tesseract.js');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function imagePreProcessing(imagePath) {
    const { stdout, stderr } = await exec(`python imageProcessing.py ${imagePath}`);
    if (stderr) {
        throw new Error(stderr);
    }
    console.log(stdout);
    return stdout;
}

async function processImage(imagePath) {
    await imagePreProcessing(imagePath);
    const worker = await createWorker('eng', '1', {
        langPath: path.join(__dirname, 'eng.traineddata.gz')
    });
    const { data: { text } } = await worker.recognize(imagePath.replace("uploads", path.join("uploads", "processed")));
    console.log(text);
    await worker.terminate();
}

processImage('public/uploads/test_bill_8.jpeg');