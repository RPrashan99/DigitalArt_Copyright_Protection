# Digital Art Copyright Protection

This project implements a blockchain-based system for securing and verifying digital art copyrights. It consists of three main parts:

- **blockchain** - Smart contracts written in Solidity using Hardhat for development and testing. The main contract (`Copyright.sol`) allows registering artworks, transferring ownership, and verifying art authenticity.
- **backend** - A Node.js/Express server that interacts with the blockchain and IPFS to store metadata and serve API endpoints for the frontend.
- **frontend** - A React application that allows users to upload art, verify ownership, and transfer copyrights using the blockchain.

## Features

- Register digital artwork with a unique hash stored on the blockchain.
- Store associated metadata on IPFS.
- Transfer ownership of artwork securely.
- Verify the authenticity of an artwork by comparing hashes.

## Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn
- Hardhat for smart contract development
- An Ethereum-compatible local network (Hardhat network)

## Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/RPrashan99/DigitalArt_Copyright_Protection.git
   cd DigitalArt_Copyright_Protection
   ```

2. **Install dependencies**
   ```sh
   # Blockchain
   cd blockchain
   npm install

   # Backend
   cd ../backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Compile and deploy smart contracts**
   ```sh
   # In the blockchain folder
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network localhost
   ```

4. **Start local development network**
   ```sh
   npx hardhat node
   ```

5. **Run backend server**
   ```sh
   cd backend
   npm start
   ```

6. **Run frontend**
   ```sh
   cd frontend
   npm start
   ```

## Testing

- **Smart contracts**: Use Hardhat test suite located in `blockchain/test`.
  ```sh
  cd blockchain
  npx hardhat test
  ```

<!-- - **Frontend tests**: There may be some tests under `frontend/src/test`. -->

## Project Structure

```
backend/           - Node.js backend with IPFS integration
blockchain/        - Solidity contracts, Hardhat configuration, deployment scripts
frontend/          - React application with components for art upload, verification, and transfer
```

## Useful Commands

- `npx hardhat compile` - compile smart contracts
- `npx hardhat test` - run contract tests
- `npx hardhat run scripts/deploy.js` - deploy contracts to a network
- `npm start` in backend or frontend folders - start respective application

## License

This project is for educational purposes and may be licensed accordingly.

---

Feel free to extend or modify this README with more details or setup steps as needed.
