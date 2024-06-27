from flask import Flask, request, jsonify
import os
from pdf2image import convert_from_bytes
from PIL import Image
import io

app = Flask(__name__)

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
    print(request.files)
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Invalid file type, only PDFs are allowed'}), 400
    
    if 'id' not in request.form:
        return jsonify({'error': 'form data not found'}), 400
    
    id = request.form['id']
    if id == '':
        return jsonify({'error': 'id is null'}),400
    

    try:
        # Read the PDF file
        pdf_bytes = file.read()

        # Convert PDF to images (one image per page)
        images = convert_from_bytes(pdf_bytes)

        # Save each page as a PNG file
        for i, image in enumerate(images):
            png_path = os.path.join(OUTPUT_FOLDER, f'test_{id}_page_{i + 1}.png')
            image.save(png_path, 'png')

        return jsonify({'message': 'PDF converted to PNG successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
