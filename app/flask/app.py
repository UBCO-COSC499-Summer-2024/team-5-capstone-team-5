from flask import Flask, request, jsonify
import os
from pdf2image import convert_from_bytes
from PIL import Image
import io
from test_grader import process_bubbles
from get_first_name import process_first_name
from get_last_name import process_last_name
from get_student_number import process_stnum
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:80"],
        "methods": ["GET", "POST", "PUT", "DELETE"]
    }
})

# Set the upload and output folder paths
UPLOAD_FOLDER = '/app/data'
OUTPUT_FOLDER = '/app/data_images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/')
def hello():
    return 'I am alive'

@app.route('/upload', methods=['POST'])
def upload_file():
    data = request.data
    '''print(request.files)
    if 'file' not in request.files:
        print('file not found in request.files')
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        print('file name is null')
        return jsonify({'error': 'No selected file'}), 400

    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Invalid file type, only PDFs are allowed'}), 400
    
    if 'courseid' not in request.headers:
        print('id not in headers')
        return jsonify({'error': 'form data not found'}), 400
    
    id = request.headers.get('courseid')
    if id == '':
        print('id null')
        return jsonify({'error': 'id is null'}),400'''
    

    try:
        # Read the PDF file
        pdf_bytes = data

        # Convert PDF to images (one image per page)
        images = convert_from_bytes(pdf_bytes)

        grades = {}
        fname = ""
        lname = ""
        stnum = ""
        answers = []
        # Save each page as a PNG file
        for i, image in enumerate(images):
            png_path = os.path.join(OUTPUT_FOLDER, f'test_{id}_page_{i + 1}.png')
            image.save(png_path, 'png')

            

            if (i+1) % 2 == 1:
                fname = process_first_name(png_path)
                lname = process_last_name(png_path)
                stnum = process_stnum(png_path)
            if (i+1) % 2 == 0:
                answers = process_bubbles(png_path)
                grades[stnum] = {
                "name": (fname + " " + lname),
                "stnum": stnum,
                "answers": answers
                }
        

        return jsonify({'message': 'PDF converted to PNG successfully', 'data': grades}), 200
    except Exception as e:
        print('error: '+str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
