import json
import os
from web3 import Web3
import random
import time
from datetime import datetime
import traceback

# Force use of mock contract for development
USE_MOCK_CONTRACT = True

# Mock storage for certificates
mock_certificates = {}
mock_token_uris = {}
mock_token_counter = 0  # Will increment to 1 on first use

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Environment variables loaded successfully")
except ImportError:
    print("dotenv not installed, using default environment variables")
    pass
except Exception as e:
    print(f"Error loading environment variables: {str(e)}")
    pass

# Web3 connection
NETWORK_RPC_URL = os.getenv("NETWORK_RPC_URL", "http://localhost:8545")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "")
PRIVATE_KEY = os.getenv("PRIVATE_KEY", "")

# Path to contract ABI file (adjust as needed)
CONTRACT_ABI_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                "../frontend/src/artifacts/contracts/CertificateNFT.sol/CertificateNFT.json")

def get_web3():
    """
    Get a Web3 instance connected to the specified network
    """
    try:
        return Web3(Web3.HTTPProvider(NETWORK_RPC_URL))
    except Exception as e:
        print(f"Web3 connection error: {str(e)}")
        return None

def get_contract_abi():
    """
    Get the contract ABI from the compiled contract
    """
    try:
        with open(CONTRACT_ABI_PATH, 'r') as f:
            contract_json = json.load(f)
            return contract_json["abi"]
    except Exception as e:
        print(f"Error loading contract ABI from {CONTRACT_ABI_PATH}: {str(e)}")
        traceback.print_exc()
        # Return a minimal ABI for development
        return [
            {
                "inputs": [
                    {"internalType": "address", "name": "to", "type": "address"},
                    {"internalType": "string", "name": "recipientName", "type": "string"},
                    {"internalType": "string", "name": "courseName", "type": "string"},
                    {"internalType": "string", "name": "description", "type": "string"},
                    {"internalType": "string", "name": "tokenURI", "type": "string"}
                ],
                "name": "issueCertificate",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
                "name": "getCertificateDetails",
                "outputs": [
                    {"internalType": "string", "name": "", "type": "string"},
                    {"internalType": "string", "name": "", "type": "string"},
                    {"internalType": "uint256", "name": "", "type": "uint256"},
                    {"internalType": "string", "name": "", "type": "string"},
                    {"internalType": "bool", "name": "", "type": "bool"}
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
                "name": "tokenURI",
                "outputs": [{"internalType": "string", "name": "", "type": "string"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
                "name": "ownerOf",
                "outputs": [{"internalType": "address", "name": "", "type": "address"}],
                "stateMutability": "view",
                "type": "function"
            }
        ]

def get_contract_address():
    """
    Get the contract address from environment or config
    """
    return CONTRACT_ADDRESS

class MockContract:
    """
    Mock contract for development when real blockchain is not available
    """
    def __init__(self):
        self.functions = self
        
    def issueCertificate(self, to, recipientName, courseName, description, tokenURI):
        global mock_token_counter
        
        class Transactor:
            def transact(self_tx):
                global mock_token_counter
                mock_token_counter += 1  # Increment first, so we start from 1
                token_id = mock_token_counter
                
                # Store certificate data
                mock_certificates[token_id] = {
                    "recipientName": recipientName,
                    "courseName": courseName,
                    "issueDate": int(time.time()),  # Use current time
                    "description": description,
                    "revoked": False,
                    "owner": to
                }
                
                # Store token URI
                mock_token_uris[token_id] = tokenURI
                
                print(f"Mock certificate created with ID: {token_id}")
                print(f"Mock certificates available: {list(mock_certificates.keys())}")
                
                # Return a mock transaction hash
                return Web3.to_bytes(hexstr=f"0x{''.join(random.choices('0123456789abcdef', k=64))}")
                
        return Transactor()
    
    def getCertificateDetails(self, token_id):
        class Caller:
            def call(self):
                print(f"Getting mock certificate details for ID: {token_id}")
                print(f"Available certificates: {list(mock_certificates.keys())}")
                
                if token_id not in mock_certificates:
                    raise Exception(f"Certificate with ID {token_id} does not exist")
                    
                cert = mock_certificates[token_id]
                return [
                    cert["recipientName"],
                    cert["courseName"],
                    cert["issueDate"],
                    cert["description"],
                    cert["revoked"]
                ]
                
        return Caller()
    
    def ownerOf(self, token_id):
        class Caller:
            def call(self):
                if token_id not in mock_certificates:
                    raise Exception(f"Certificate with ID {token_id} does not exist")
                
                return mock_certificates[token_id]["owner"]
                
        return Caller()
    
    def tokenURI(self, token_id):
        class Caller:
            def call(self):
                if token_id not in mock_token_uris:
                    raise Exception(f"Token URI for ID {token_id} does not exist")
                
                return mock_token_uris[token_id]
                
        return Caller()
    
    def updateCertificate(self, token_id, recipientName, courseName, description, tokenURI):
        class Transactor:
            def transact(self_tx):
                if token_id not in mock_certificates:
                    raise Exception(f"Certificate with ID {token_id} does not exist")
                
                # Update certificate data
                mock_certificates[token_id] = {
                    **mock_certificates[token_id],
                    "recipientName": recipientName,
                    "courseName": courseName,
                    "description": description,
                }
                
                # Update token URI if provided
                if tokenURI:
                    mock_token_uris[token_id] = tokenURI
                    
                # Return a mock transaction hash
                return Web3.to_bytes(hexstr=f"0x{''.join(random.choices('0123456789abcdef', k=64))}")
                
        return Transactor()
        
    def revokeCertificate(self, token_id):
        class Transactor:
            def transact(self_tx):
                if token_id not in mock_certificates:
                    raise Exception(f"Certificate with ID {token_id} does not exist")
                
                # Mark certificate as revoked
                mock_certificates[token_id]["revoked"] = True
                
                # Return a mock transaction hash
                return Web3.to_bytes(hexstr=f"0x{''.join(random.choices('0123456789abcdef', k=64))}")
                
        return Transactor()

def get_contract():
    """
    Get a contract instance with the current account set as the default account
    """
    if USE_MOCK_CONTRACT:
        print("Using mock contract...")
        return MockContract()
        
    web3 = get_web3()
    if web3 is None:
        print("Web3 connection failed. Using mock contract...")
        return MockContract()
    
    # Set up the account to use for transactions
    if PRIVATE_KEY:
        account = web3.eth.account.from_key(PRIVATE_KEY)
        web3.eth.default_account = account.address
    else:
        # Use the first account for development
        try:
            web3.eth.default_account = web3.eth.accounts[0]
        except Exception as e:
            print(f"Failed to set default account: {str(e)}")
            return MockContract()
    
    # Get the contract
    contract_address = get_contract_address()
    if not contract_address or not web3.is_address(contract_address):
        print("Invalid contract address. Using mock contract...")
        return MockContract()
    
    abi = get_contract_abi()
    contract = web3.eth.contract(address=contract_address, abi=abi)
    
    return contract

def deploy_contract():
    """
    Deploy the contract and return the address
    """
    if USE_MOCK_CONTRACT:
        return "0x" + "1234" * 10  # Return a mock contract address
        
    web3 = get_web3()
    if web3 is None:
        return "0x" + "1234" * 10  # Return a mock contract address
    
    # Set up the account to use for deployment
    if PRIVATE_KEY:
        account = web3.eth.account.from_key(PRIVATE_KEY)
        web3.eth.default_account = account.address
    else:
        # Use the first account for development
        web3.eth.default_account = web3.eth.accounts[0]
    
    # Load the contract ABI and bytecode
    try:
        with open(CONTRACT_ABI_PATH, 'r') as f:
            contract_json = json.load(f)
            contract_abi = contract_json["abi"]
            contract_bytecode = contract_json["bytecode"]
    except Exception as e:
        print(f"Error loading contract: {str(e)}")
        return "0x" + "1234" * 10  # Return a mock contract address
    
    # Create the contract
    contract = web3.eth.contract(abi=contract_abi, bytecode=contract_bytecode)
    
    # Deploy the contract
    tx_hash = contract.constructor().transact()
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    
    return tx_receipt.contractAddress 