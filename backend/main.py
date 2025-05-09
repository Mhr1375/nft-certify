from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
import os
import json
import shutil
import time
from datetime import datetime
import ipfshttpclient
from web3 import Web3
import uvicorn
import sys
from dotenv import load_dotenv, find_dotenv, set_key

# Add the current directory to the path so Python can find our local modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our local modules
from utils.contract import get_contract, mock_token_counter
from utils.ipfs import upload_to_ipfs, get_ipfs_url

app = FastAPI(title="NFT Certificate API")

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads folder if it doesn't exist
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
print(f"Uploads directory: {UPLOADS_DIR}")

# Mount static files directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Models
class CertificateCreate(BaseModel):
    recipient_name: str
    recipient_address: str
    course_name: str
    issue_date: str
    description: str

class CertificateResponse(BaseModel):
    id: int
    recipient_name: str
    recipient_address: str
    course_name: str
    issue_date: str
    description: str
    token_uri: str
    transaction_hash: str

class TokenUriMetadata(BaseModel):
    name: str
    description: str
    image: str
    attributes: List[dict]

# Endpoints
@app.get("/")
def read_root():
    return {"message": "NFT Certificate API is running"}

@app.post("/api/certificates", response_model=CertificateResponse)
async def create_certificate(
    recipient_name: str = Form(...),
    recipient_address: str = Form(...),
    course_name: str = Form(...),
    issue_date: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...)
):
    try:
        print(f"Received certificate creation request for: {recipient_name}")
        
        # Create a certificate_data object to maintain code consistency
        certificate_data = CertificateCreate(
            recipient_name=recipient_name,
            recipient_address=recipient_address,
            course_name=course_name,
            issue_date=issue_date,
            description=description
        )
        
        # Save image temporarily
        timestamp = int(time.time())
        file_path = os.path.join(UPLOADS_DIR, f"{timestamp}_{image.filename}")
        print(f"Saving image to: {file_path}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Upload image to IPFS
        print("Uploading image to IPFS...")
        image_ipfs_hash = await upload_to_ipfs(file_path)
        image_url = get_ipfs_url(image_ipfs_hash)
        print(f"Image IPFS URL: {image_url}")
        
        # Create metadata for NFT
        metadata = {
            "name": f"Certificate: {certificate_data.course_name}",
            "description": certificate_data.description,
            "image": image_url,
            "attributes": [
                {"trait_type": "Recipient Name", "value": certificate_data.recipient_name},
                {"trait_type": "Course Name", "value": certificate_data.course_name},
                {"trait_type": "Issue Date", "value": certificate_data.issue_date}
            ]
        }
        
        # Upload metadata to IPFS
        metadata_file = os.path.join(UPLOADS_DIR, f"{timestamp}_metadata.json")
        with open(metadata_file, "w") as f:
            json.dump(metadata, f)
        
        print("Uploading metadata to IPFS...")
        metadata_ipfs_hash = await upload_to_ipfs(metadata_file)
        token_uri = get_ipfs_url(metadata_ipfs_hash)
        print(f"Metadata URI: {token_uri}")
        
        # Get contract instance
        print("Getting contract instance...")
        contract = get_contract()
        
        # Issue certificate via smart contract
        print("Issuing certificate via contract...")
        tx_hash = contract.functions.issueCertificate(
            certificate_data.recipient_address,
            certificate_data.recipient_name,
            certificate_data.course_name,
            certificate_data.description,
            token_uri
        ).transact()
        
        print(f"Transaction hash: {tx_hash}")
        
        # Get the updated token counter after transaction
        # The mock contract increments the counter before creating the token
        from utils.contract import mock_token_counter
        token_id = mock_token_counter  # This should now be the ID of the newly created token
        
        print(f"Using token ID: {token_id}")
        
        return {
            "id": token_id,
            "recipient_name": certificate_data.recipient_name,
            "recipient_address": certificate_data.recipient_address,
            "course_name": certificate_data.course_name,
            "issue_date": certificate_data.issue_date,
            "description": certificate_data.description,
            "token_uri": token_uri,
            "transaction_hash": tx_hash.hex() if hasattr(tx_hash, 'hex') else str(tx_hash)
        }
    
    except Exception as e:
        print(f"Error in create_certificate: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/certificates/{token_id}")
async def get_certificate(token_id: int):
    try:
        print(f"Fetching certificate with ID: {token_id}")
        contract = get_contract()
        try:
            certificate = contract.functions.getCertificateDetails(token_id).call()
            owner = contract.functions.ownerOf(token_id).call()
            token_uri = contract.functions.tokenURI(token_id).call()
        except Exception as e:
            print(f"Error getting certificate details from contract: {str(e)}")
            raise HTTPException(status_code=404, detail=f"Certificate with ID {token_id} not found")
        
        return {
            "id": token_id,
            "recipient_name": certificate[0],
            "course_name": certificate[1],
            "issue_date": datetime.fromtimestamp(certificate[2]).strftime("%Y-%m-%d"),
            "description": certificate[3],
            "revoked": certificate[4],
            "owner": owner,
            "token_uri": token_uri
        }
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"Error in get_certificate: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/certificates")
async def list_certificates():
    try:
        contract = get_contract()
        # Get total supply of tokens
        # Note: This assumes the contract has a totalSupply function or similar
        # You might need to implement custom logic to get all tokens
        
        certificates = []
        # In a real app, you would have a more efficient way to iterate through tokens
        # For simplicity, we're using a range up to a reasonable max number
        for token_id in range(1, 100):
            try:
                certificate = contract.functions.getCertificateDetails(token_id).call()
                owner = contract.functions.ownerOf(token_id).call()
                token_uri = contract.functions.tokenURI(token_id).call()
                
                certificates.append({
                    "id": token_id,
                    "recipient_name": certificate[0],
                    "course_name": certificate[1],
                    "issue_date": datetime.fromtimestamp(certificate[2]).strftime("%Y-%m-%d"),
                    "description": certificate[3],
                    "revoked": certificate[4],
                    "owner": owner,
                    "token_uri": token_uri
                })
            except:
                # Token does not exist, stop the loop
                break
                
        return certificates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/certificates/{token_id}")
async def update_certificate(
    token_id: int,
    recipient_name: str = Form(...),
    recipient_address: str = Form(...),
    course_name: str = Form(...),
    issue_date: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    try:
        contract = get_contract()
        
        # Create a certificate_data object
        certificate_data = CertificateCreate(
            recipient_name=recipient_name,
            recipient_address=recipient_address,
            course_name=course_name,
            issue_date=issue_date,
            description=description
        )
        
        # Get existing token URI
        existing_token_uri = contract.functions.tokenURI(token_id).call()
        token_uri = existing_token_uri
        
        # If an image is provided, update the metadata
        if image:
            # Save image temporarily
            timestamp = int(time.time())
            file_path = f"uploads/{timestamp}_{image.filename}"
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            # Upload image to IPFS
            image_ipfs_hash = await upload_to_ipfs(file_path)
            image_url = get_ipfs_url(image_ipfs_hash)
            
            # Create metadata for NFT
            metadata = {
                "name": f"Certificate: {certificate_data.course_name}",
                "description": certificate_data.description,
                "image": image_url,
                "attributes": [
                    {"trait_type": "Recipient Name", "value": certificate_data.recipient_name},
                    {"trait_type": "Course Name", "value": certificate_data.course_name},
                    {"trait_type": "Issue Date", "value": certificate_data.issue_date}
                ]
            }
            
            # Upload metadata to IPFS
            metadata_file = f"uploads/{timestamp}_metadata.json"
            with open(metadata_file, "w") as f:
                json.dump(metadata, f)
            
            metadata_ipfs_hash = await upload_to_ipfs(metadata_file)
            token_uri = get_ipfs_url(metadata_ipfs_hash)
        
        # Update certificate
        # Note: This depends on your contract having an updateCertificate function
        tx_hash = contract.functions.updateCertificate(
            token_id,
            certificate_data.recipient_name,
            certificate_data.course_name,
            certificate_data.description,
            token_uri
        ).transact()
        
        # Wait for transaction receipt
        tx_receipt = Web3().eth.wait_for_transaction_receipt(tx_hash)
        
        return {
            "id": token_id,
            "recipient_name": certificate_data.recipient_name,
            "recipient_address": certificate_data.recipient_address,
            "course_name": certificate_data.course_name,
            "issue_date": certificate_data.issue_date,
            "description": certificate_data.description,
            "token_uri": token_uri,
            "transaction_hash": tx_hash.hex() if hasattr(tx_hash, 'hex') else str(tx_hash)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/certificates/{token_id}")
async def revoke_certificate(token_id: int):
    try:
        contract = get_contract()
        
        # Revoke the certificate
        tx_hash = contract.functions.revokeCertificate(token_id).transact()
        
        # Wait for transaction receipt
        tx_receipt = Web3().eth.wait_for_transaction_receipt(tx_hash)
        
        return {"message": f"Certificate {token_id} revoked successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/network")
async def get_network_info():
    try:
        web3 = Web3(Web3.HTTPProvider(os.getenv("NETWORK_RPC_URL", "http://localhost:8545")))
        
        # Get network ID
        network_id = web3.eth.chain_id
        
        # Map network ID to name
        networks = {
            1: "Ethereum Mainnet",
            3: "Ropsten Testnet",
            4: "Rinkeby Testnet",
            5: "Goerli Testnet",
            42: "Kovan Testnet",
            56: "Binance Smart Chain",
            97: "Binance Smart Chain Testnet",
            137: "Polygon Mainnet",
            80001: "Polygon Mumbai Testnet",
            1337: "Local Development Chain",
            31337: "Hardhat Network"
        }
        
        network_name = networks.get(network_id, f"Unknown Network (ID: {network_id})")
        
        return {
            "networkId": network_id,
            "networkName": network_name,
            "contractAddress": os.getenv("CONTRACT_ADDRESS", ""),
            "rpcUrl": os.getenv("NETWORK_RPC_URL", "http://localhost:8545")
        }
    except Exception as e:
        # For development, return mock data
        return {
            "networkId": 1337,
            "networkName": "Local Development Chain (Mock)",
            "contractAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            "rpcUrl": "http://localhost:8545"
        }

@app.get("/api/settings")
async def get_settings():
    """
    Get current platform settings
    """
    try:
        # Import these values from the modules to ensure we get current values
        from utils.contract import USE_MOCK_CONTRACT, NETWORK_RPC_URL, CONTRACT_ADDRESS
        from utils.ipfs import USE_MOCK_IPFS, PINATA_API_KEY, PINATA_SECRET_KEY
        
        return {
            "useMockContract": USE_MOCK_CONTRACT,
            "useMockIPFS": USE_MOCK_IPFS,
            "networkRpcUrl": NETWORK_RPC_URL,
            "contractAddress": CONTRACT_ADDRESS,
            "pinataApiKey": PINATA_API_KEY,
            "pinataSecretKey": "********" if PINATA_SECRET_KEY else ""
        }
    except Exception as e:
        print(f"Error getting settings: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/settings")
async def update_settings(settings: dict):
    """
    Update platform settings
    """
    try:
        # Find the .env file path
        env_file = find_dotenv()
        if not env_file:
            # If no .env file exists, create one
            env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
            with open(env_file, "w") as f:
                f.write("# NFT Certificate Platform Settings\n")
        
        # Update settings in .env file
        set_key(env_file, "USE_MOCK_CONTRACT", str(settings["useMockContract"]))
        set_key(env_file, "USE_MOCK_IPFS", str(settings["useMockIPFS"]))
        set_key(env_file, "NETWORK_RPC_URL", settings["networkRpcUrl"])
        set_key(env_file, "CONTRACT_ADDRESS", settings["contractAddress"])
        set_key(env_file, "PINATA_API_KEY", settings["pinataApiKey"])
        
        # Only update secret key if it's not masked
        if settings["pinataSecretKey"] and settings["pinataSecretKey"] != "********":
            set_key(env_file, "PINATA_SECRET_KEY", settings["pinataSecretKey"])
        
        # Reload environment variables
        load_dotenv(override=True)
        
        # Also update in-memory variables
        import utils.contract
        import utils.ipfs
        
        utils.contract.USE_MOCK_CONTRACT = settings["useMockContract"]
        utils.contract.NETWORK_RPC_URL = settings["networkRpcUrl"]
        utils.contract.CONTRACT_ADDRESS = settings["contractAddress"]
        
        utils.ipfs.USE_MOCK_IPFS = settings["useMockIPFS"]
        utils.ipfs.PINATA_API_KEY = settings["pinataApiKey"]
        if settings["pinataSecretKey"] and settings["pinataSecretKey"] != "********":
            utils.ipfs.PINATA_SECRET_KEY = settings["pinataSecretKey"]
        
        return {"message": "Settings updated successfully"}
    except Exception as e:
        print(f"Error updating settings: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 