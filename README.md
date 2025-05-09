# NFT Certificate Issuance Platform

An open-source platform for issuing and managing NFT certificates on Ethereum-compatible networks. This platform allows educational institutions, businesses, or organizations to create verifiable digital certificates as NFTs.

![NFT Certificate Platform](frontend/public/screenshot.png)

## Features

- ✅ Connect to MetaMask wallet
- ✅ Issue NFT certificates with custom metadata
- ✅ Upload certificate images to IPFS
- ✅ View all issued certificates
- ✅ Search and filter certificates
- ✅ Verify certificate authenticity
- ✅ User-friendly interface with animations
- ✅ Development mode with mock blockchain & IPFS
- ✅ Configurable settings for blockchain and IPFS
- ✅ Cross-platform compatibility (Windows, Linux, macOS)

## Project Structure

The project consists of three main components:

1. **Smart Contract**: Solidity-based NFT contract for certificate issuance
2. **Frontend**: React application with Material UI components
3. **Backend**: Python FastAPI server with Web3 and IPFS integration

```
nft-certificate-platform/
├── frontend/             # React frontend application
├── backend/              # Python FastAPI backend server
├── smart_contract/       # Solidity smart contracts
├── scripts/              # Helper scripts for running the platform
│   ├── start_all.bat     # Windows script to start all services
│   ├── start-all.sh      # Linux/macOS script to start all services
│   ├── capture_screenshot.bat  # Windows screenshot helper
│   └── capture_screenshot.sh   # Linux/macOS screenshot helper
├── run.bat               # Windows launcher script
├── run.sh                # Linux/macOS launcher script
├── README.md             # This documentation
└── .gitignore            # Git ignore file
```

## Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MetaMask** browser extension (for production use)
- **Git**

## Quick Start (One-Click Launch)

### Windows

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nft-certificate-platform.git
   cd nft-certificate-platform
   ```

2. Set up the environment:
   ```
   cd frontend && npm install && cd ..
   cd backend && pip install -r requirements.txt && cd ..
   ```

3. Launch the application with a single click:
   
   Using Command Prompt (cmd):
   ```
   .\run.bat
   ```

   Using PowerShell:
   ```powershell
   .\scripts\powershell_run.ps1
   ```

4. Open your browser and navigate to: http://localhost:3000

### Linux/macOS

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nft-certificate-platform.git
   cd nft-certificate-platform
   ```

2. Set up the environment:
   ```bash
   cd frontend && npm install && cd ..
   cd backend && pip install -r requirements.txt && cd ..
   ```

3. Make the launch script executable and run it:
   ```bash
   chmod +x run.sh
   ./run.sh
   ```

4. Open your browser and navigate to: http://localhost:3000

## Manual Startup

### Windows (PowerShell)

Start each server in a separate terminal:

```powershell
# Terminal 1 - Backend
cd backend; python -m uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend; npm start
```

### Linux/macOS

Start each server in a separate terminal:

```bash
# Terminal 1 - Backend
cd backend && python -m uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend && npm start
```

## Development Mode

The platform operates in development mode by default with mock implementations of blockchain and IPFS services. This allows you to test the platform without connecting to actual networks.

### Using the Settings Page

The platform includes a dedicated Settings page where you can configure:

1. **Blockchain Settings**:
   - Toggle between mock and real blockchain
   - Set the Network RPC URL (e.g., Infura endpoint)
   - Configure the deployed contract address

2. **IPFS Settings**:
   - Toggle between mock and real IPFS
   - Configure Pinata API and Secret keys for actual IPFS storage

Changes to these settings are stored in the backend's `.env` file and take effect after restarting the servers.

## Smart Contract Deployment (Optional)

For production use, you'll need to deploy the smart contract to an actual network:

```bash
cd smart_contract
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network <your-network>
```

After deployment, update the contract address in the Settings page or directly in the backend's `.env` file.

## Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory (or use the Settings page):

```
# Network Configuration
NETWORK_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PRIVATE_KEY=your-private-key-for-production

# IPFS Configuration (optional)
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key

# Mock settings
USE_MOCK_CONTRACT=True
USE_MOCK_IPFS=True
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```
REACT_APP_API_URL=http://localhost:8000
```

## Application Workflow

1. **Connect Wallet**: Use the Connect Wallet button to link your MetaMask wallet
2. **Issue Certificate**: Fill in certificate details and upload an image
3. **View Certificates**: Browse all issued certificates in a grid or list view
4. **Certificate Details**: View detailed information about a specific certificate
5. **Settings**: Configure blockchain and IPFS options for development or production use

## Troubleshooting

### Common Issues

1. **"Cannot find module 'X'"**:
   - Make sure you've run `npm install` in the frontend directory
   - Check that the module is listed in package.json

2. **"Could not import module 'main'"**:
   - Make sure you're running the backend from inside the `backend` directory
   - Use `cd backend; python -m uvicorn main:app --reload` on Windows
   - Use `cd backend && python -m uvicorn main:app --reload` on Linux/macOS

3. **"Certificate not found" after creation**:
   - This is likely a token ID tracking issue
   - Restart both the backend and frontend servers

4. **PowerShell command chaining**:
   - Use semicolons (`;`) instead of `&&` in PowerShell
   - Example: `cd backend; python -m uvicorn main:app --reload`
   - Alternatively, use our provided PowerShell script: `.\scripts\powershell_run.ps1`

5. **"The token '&&' is not a valid statement separator" in PowerShell**:
   - Use `;` instead of `&&` for command chaining in PowerShell
   - Alternatively, use Command Prompt (cmd) which supports `&&`
   - Or use our dedicated PowerShell script: `.\scripts\powershell_run.ps1`

6. **"run.bat is not recognized as an internal or external command"**:
   - In PowerShell, use `.\run.bat` (with the leading `.\`)
   - Alternatively, use our PowerShell script: `.\scripts\powershell_run.ps1`

## Security Considerations

In production environments:

1. **Use HTTPS**: Configure your deployment to use HTTPS for all communications
2. **Secure Private Keys**: Never expose private keys in your code or public repositories
3. **API Rate Limiting**: Implement rate limiting on backend APIs
4. **Input Validation**: Ensure all user inputs are validated server-side

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Creating Screenshots

To update the application screenshot in the README:

1. Run the screenshot helper script:
   - Windows: `scripts\capture_screenshot.bat`
   - Linux/macOS: `./scripts/capture_screenshot.sh`
   
2. The script will launch the application and guide you through the process of capturing and saving a screenshot.

3. Navigate to the most visually appealing screen (like the dashboard or certificate view) before capturing.

4. Save the screenshot as `frontend/public/screenshot.png` to automatically update the image in the README.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 