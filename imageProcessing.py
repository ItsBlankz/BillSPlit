import cv2
import os
import sys
from PIL import Image
import numpy as np
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

def save(img_object, original_image_path:str):
    cv2.imwrite(original_image_path.replace("uploads", os.path.join("uploads", "processed")) , img_object)

def noise_removal(img_object):
    
    # Invert Image
    denoised = cv2.bitwise_not(img_object)

    # Remove noise as much as possible
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    denoised = cv2.erode(denoised, kernel, iterations=1)
    denoised = cv2.dilate(denoised, kernel, iterations=5)

    # Invert Image back
    denoised = cv2.bitwise_not(denoised)

    return (img_object)

def processImage(image_file):
    img = cv2.imread(image_file)

    # Convert to grayscale
    gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Blur the image
    blurred_image = cv2.GaussianBlur(gray_image, (7, 7), 0)

    # Apply Adaptive Thresholding with Gaussian window (requires fine tuning for the values of 21 & 4)
    adaptive_thresholded_img = cv2.adaptiveThreshold(
        blurred_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 4
    )

    # Noise Removal
    noise_removed = noise_removal(adaptive_thresholded_img)

    # print(pytesseract.image_to_data(Image.open('test.png')))

    # print(pytesseract.image_to_string(noise_removed))

    # public/uploads/test_bill_6.jpeg
    
    f = open(f"{image_file.split('/')[-1].split('.')[0]}.txt", "w")
    f.write(pytesseract.image_to_string(noise_removed))
    f.close()

    # save(noise_removed, image_file)

    print("file processed successfully")



# processImage(sys.argv[1])

path = os.path.join(os.getcwd(), 'public', 'uploads')
path1 = os.path.join(os.getcwd(), 'boxes')
processed_path = os.path.join(os.getcwd(), 'public', 'uploads', 'processed')

if os.path.exists(processed_path):
    for file in os.listdir(processed_path):
        os.remove(os.path.join(processed_path, file))

if os.path.exists(path1):
    for file in os.listdir(path1):
        try:
            os.remove(os.path.join(path1, file))
        except Exception as e:
            print(e)
            print(f'Error deleting {file}')

# processImage("public/uploads/test_bill_6.jpeg")

if os.path.exists(path):
    for file in os.listdir(path):
        try:
            if os.path.isfile(os.path.join(path, file)):
                processImage(os.path.join(path, file))
                print(f"{file} processed successfully.")
        except Exception as e:
            print(e)
            print(f'Error processing {file}')
