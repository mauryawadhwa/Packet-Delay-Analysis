import os
import pyshark
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Configure TShark path
os.environ['WIRESHARK_PATH'] = '/opt/homebrew/bin'
from werkzeug.utils import secure_filename
import pyshark
import pandas as pd
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pcap', 'pcapng', 'cap', 'etl', 'erf'}

def get_file_format(filename):
    """Determine the packet capture format from the file extension."""
    ext = filename.rsplit('.', 1)[1].lower()
    format_map = {
        'pcap': 'pcap',
        'pcapng': 'pcapng',
        'cap': 'pcap',  # Handle .cap as pcap format
        'etl': 'etl',
        'erf': 'erf'
    }
    return format_map.get(ext)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_pcap(filepath, file_format):
    """Analyze packet capture file and compute delay metrics.
    
    Args:
        filepath (str): Path to the capture file
        file_format (str): Format of the capture file (pcap, pcapng, etl, erf)
    """
    packets = []
    cap = None
    temp_pcap = None

    try:
        # Initialize the capture based on file format
        if file_format in ['pcap', 'pcapng', 'cap']:
            cap = pyshark.FileCapture(filepath)
        elif file_format == 'etl':
            # For ETL files, we need to convert them to pcap first
            temp_pcap = filepath + '.pcap'
            os.system(f'etl2pcap {filepath} {temp_pcap}')
            cap = pyshark.FileCapture(temp_pcap)
        elif file_format == 'erf':
            # For ERF files, use special handling
            cap = pyshark.FileCapture(filepath, custom_parameters=['-F', 'erf'])
        else:
            raise ValueError(f'Unsupported file format: {file_format}')

        # Process packets
        for packet in cap:
            if hasattr(packet, 'ip'):
                packets.append({
                    'timestamp': float(packet.sniff_timestamp),
                    'protocol': packet.highest_layer,
                    'src_ip': packet.ip.src,
                    'dst_ip': packet.ip.dst,
                    'length': int(packet.length)
                })
    except Exception as e:
        raise Exception(f'Error processing {file_format} file: {str(e)}')
    finally:
        if cap:
            cap.close()
        if temp_pcap and os.path.exists(temp_pcap):
            os.remove(temp_pcap)  # Clean up temporary files
    
    if not packets:
        return {
            'error': 'No IP packets found in the capture file'
        }
    
    df = pd.DataFrame(packets)
    
    # Calculate metrics
    metrics = {
        'total_packets': len(df),
        'protocols': df['protocol'].value_counts().to_dict(),
        'unique_ips': {
            'sources': df['src_ip'].nunique(),
            'destinations': df['dst_ip'].nunique()
        }
    }
    
    # Calculate delays and jitter
    df['delay'] = df['timestamp'].diff()
    metrics['latency'] = {
        'mean': df['delay'].mean(),
        'median': df['delay'].median(),
        'std': df['delay'].std()
    }
    
    # Calculate jitter (variation in delay)
    df['jitter'] = df['delay'].diff().abs()
    metrics['jitter'] = {
        'mean': df['jitter'].mean(),
        'median': df['jitter'].median(),
        'std': df['jitter'].std()
    }
    
    return metrics

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            file_format = get_file_format(filename)
            if not file_format:
                return jsonify({'error': 'Unsupported file format'}), 400
            
            analysis_results = analyze_pcap(filepath, file_format)
            return jsonify(analysis_results)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            # Optionally remove the file after analysis
            if os.path.exists(filepath):
                os.remove(filepath)
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/analyze', methods=['GET'])
def get_analysis():
    """Endpoint to retrieve analysis results (placeholder for database integration)"""
    # TODO: Implement database integration
    return jsonify({'message': 'Analysis endpoint placeholder'})

# Serve the static files and React app in production
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join('static', path)):
        return send_from_directory('static', path)
    return send_from_directory('static', 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
