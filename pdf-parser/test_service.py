#!/usr/bin/env python3
"""
Test script for PDF Parser Service
"""

import requests
import sys
import os

def test_service():
    """Test the PDF parser service"""
    service_url = "http://localhost:8001"
    
    # Test health endpoint
    try:
        response = requests.get(f"{service_url}/health")
        if response.status_code == 200:
            print("✅ Service is running and healthy")
            print(f"Health check: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to service. Make sure it's running on port 8001")
        print("Start with: uvicorn app:app --port 8001 --reload")
        return False
    
    # Test root endpoint
    try:
        response = requests.get(service_url)
        if response.status_code == 200:
            print("✅ Root endpoint working")
            data = response.json()
            print(f"Service: {data.get('service')}")
            print(f"Version: {data.get('version')}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
    
    return True

if __name__ == "__main__":
    print("Testing PDF Parser Service...")
    if test_service():
        print("\n🚀 Service is ready for PDF parsing!")
        print("Test with: curl -F \"file=@sample.pdf\" http://localhost:8001/parse-pdf")
    else:
        print("\n❌ Service test failed")
        sys.exit(1)
