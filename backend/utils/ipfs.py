import ipfshttpclient
import aiofiles
import os
import requests
from typing import Optional
import json
import traceback

# IPFS connection (adjust these settings as needed)
IPFS_HOST = "127.0.0.1"
IPFS_PORT = 5001
IPFS_GATEWAY = "https://ipfs.io/ipfs/"

# Alternative: Use Pinata, Infura, or other IPFS providers
PINATA_API_KEY = os.getenv("PINATA_API_KEY", "")
PINATA_SECRET_KEY = os.getenv("PINATA_SECRET_KEY", "")
USE_PINATA = PINATA_API_KEY and PINATA_SECRET_KEY

# For development: use mock IPFS if true
USE_MOCK_IPFS = True  # Set to False to use real IPFS

def get_placeholder_url(ipfs_hash):
    """
    Generate a placeholder URL for mock IPFS
    """
    filename = ipfs_hash.replace("mock_ipfs_hash_", "")
    if filename.endswith('.json'):
        return f"https://via.placeholder.com/400?text=Metadata:{filename}"
    else:
        return f"https://via.placeholder.com/400?text=Image:{filename}"

async def upload_to_ipfs(file_path: str) -> str:
    """
    Upload a file to IPFS and return the hash
    """
    try:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return f"mock_ipfs_hash_file_not_found_{os.path.basename(file_path)}"
            
        if USE_MOCK_IPFS:
            print(f"Using mock IPFS for {file_path}")
            return f"mock_ipfs_hash_{os.path.basename(file_path)}"
            
        if USE_PINATA:
            return await upload_to_pinata(file_path)
        
        try:
            # Connect to local IPFS daemon
            client = ipfshttpclient.connect(f'/ip4/{IPFS_HOST}/tcp/{IPFS_PORT}/http')
            
            # Read file and add to IPFS
            with open(file_path, 'rb') as f:
                result = client.add(f.read())
                
            # Return the hash of the file
            return result['Hash']
        except Exception as e:
            # If IPFS daemon is not available, use a mock for development
            print(f"IPFS Error (falling back to mock): {str(e)}")
            traceback.print_exc()
            return f"mock_ipfs_hash_{os.path.basename(file_path)}"
    except Exception as e:
        print(f"Error in upload_to_ipfs: {str(e)}")
        traceback.print_exc()
        return f"mock_ipfs_hash_error_{os.path.basename(file_path)}"

async def upload_to_pinata(file_path: str) -> str:
    """
    Upload a file to Pinata IPFS service
    """
    try:
        pinata_url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
        headers = {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_KEY
        }
        
        with open(file_path, 'rb') as f:
            files = {'file': (os.path.basename(file_path), f)}
            response = requests.post(pinata_url, files=files, headers=headers)
            
        if response.status_code == 200:
            return response.json()['IpfsHash']
        else:
            raise Exception(f"Pinata upload failed: {response.text}")
    except Exception as e:
        print(f"Pinata Error: {str(e)}")
        traceback.print_exc()
        return f"mock_ipfs_hash_{os.path.basename(file_path)}"

def get_ipfs_url(ipfs_hash: str) -> str:
    """
    Get the IPFS URL for a given hash
    """
    if ipfs_hash.startswith("mock_ipfs_hash_"):
        # For mock IPFS, return a URL to a placeholder image
        return get_placeholder_url(ipfs_hash)
    return f"ipfs://{ipfs_hash}"

async def get_from_ipfs(ipfs_hash: str) -> Optional[dict]:
    """
    Get JSON data from IPFS
    """
    try:
        if ipfs_hash.startswith("mock_ipfs_hash_"):
            # For mock IPFS, return a placeholder JSON
            filename = ipfs_hash.replace("mock_ipfs_hash_", "")
            return {
                "name": f"Mock Certificate: {filename}",
                "description": "This is a mock certificate for development purposes",
                "image": get_placeholder_url(f"mock_ipfs_hash_image_{filename}"),
                "attributes": [
                    {"trait_type": "Environment", "value": "Development"},
                    {"trait_type": "Type", "value": "Mock Certificate"}
                ]
            }
            
        try:
            # Try to get from IPFS gateway
            response = requests.get(f"{IPFS_GATEWAY}{ipfs_hash}")
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            print(f"Error fetching from IPFS: {str(e)}")
            traceback.print_exc()
            return None
    except Exception as e:
        print(f"Error in get_from_ipfs: {str(e)}")
        traceback.print_exc()
        return None 