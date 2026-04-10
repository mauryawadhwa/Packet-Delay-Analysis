import pytest
import os
from app import app
import io

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_upload_no_file(client):
    """Test upload endpoint without file"""
    response = client.post('/upload')
    assert response.status_code == 400
    assert b'No file part' in response.data

def test_upload_empty_filename(client):
    """Test upload endpoint with empty filename"""
    response = client.post('/upload', data={
        'file': (io.BytesIO(b''), '')
    })
    assert response.status_code == 400
    assert b'No selected file' in response.data

def test_upload_invalid_extension(client):
    """Test upload endpoint with invalid file extension"""
    response = client.post('/upload', data={
        'file': (io.BytesIO(b'test data'), 'test.txt')
    })
    assert response.status_code == 400
    assert b'Invalid file type' in response.data

def test_analyze_endpoint(client):
    """Test analyze endpoint"""
    response = client.get('/analyze')
    assert response.status_code == 200
    assert b'Analysis endpoint placeholder' in response.data
