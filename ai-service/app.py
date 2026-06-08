import os
from flask import Flask, request, jsonify
from inference import process_video, process_image

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process():
    data = request.json
    task_id = data.get('taskId')
    input_path = data.get('inputPath')
    filename = data.get('filename')

    if not task_id or not input_path:
        return jsonify({"error": "Missing taskId or inputPath"}), 400

    try:
        output_path = process_video(input_path, task_id)
        return jsonify({
            "taskId": task_id,
            "status": "completed",
            "outputPath": output_path
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/process-image', methods=['POST'])
def process_image_route():
    data = request.json
    task_id = data.get('taskId')
    input_path = data.get('inputPath')

    if not task_id or not input_path:
        return jsonify({"error": "Missing taskId or inputPath"}), 400

    try:
        output_path = process_image(input_path, task_id)
        return jsonify({
            "taskId": task_id,
            "status": "completed",
            "outputPath": output_path
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PYTHON_PORT', 8000))
    app.run(host='0.0.0.0', port=port)
