<div id="top"></div>

<!-- ABOUT THE PROJECT -->
## Decentralized Marketplace App- LEGO LAND

![image](https://github.com/sairamp98/Blockchain_decentralized_marketplace_sepoliaeth/assets/165452102/80713b88-f764-4d2b-a6f7-e64403f513a0)

This decentralized marketplace is designed for Ethereum and other EVM-compatible blockchains. It enables global users to securely buy and sell items in an anonymous environment. All transactions are conducted in cryptocurrencies like ETH, with every step of the transaction controlled by the Marketplace smart contract.

### Built With

* [Next.js](https://nextjs.org/)
* [Solidity](https://docs.soliditylang.org/)
* [ethers.js](https://docs.ethers.io/v5/)
* [IPFS](https://www.pinata.cloud/)

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#how-it-works">How it Works</a></li>
    <li>
      <a href="#usage">How to Use</a>
      <ul>
        <li><a href="#frontend">Frontend</a></li>
        <li><a href="#smart-contract">Smart Contract</a></li>
        <li><a href="#deployment">Deployment</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Ensure you have the following installed:
* [Node.js and npm](https://nodejs.org/en/download/)
* [MetaMask](https://metamask.io/) (or another Ethereum wallet) as a browser extension

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/sairamp98/Blockchain_decentralized_marketplace_sepoliaeth
   cd my-app
2. **Install NPM packages for the frontend:**
   ```sh
   npm install
   npm install ethers
   npm install axios
3. **Environment Setup:**
   * Create a .env.local file in the root of your frontend directory and add your pinata API and secret keys for security purposes. (However, I hardcoded them as this is non-confidential data)
   * Once you create your contract in solidity, make sure to change the contract address in constants.json with your contract address and replace the content of Transactions.json with the contents of your abi file downloaded from Remix IDE or the abi file that you may obtain from your solidity compiler.
4. **Start the development server:**
   ```sh
   npm run dev
<!-- HOW IT WORKS -->
## How it Works
The app allows users to list and purchase items in a decentralized manner. Users can list items with a USD price tag, but transactions are processed in ETH or another specified cryptocurrency. The smart contract ensures that all transactions are secure and executed as per the encoded rules.

**Key Features:**
* Item Listing: Users can list items with detailed descriptions and set prices in ETH.
* Purchasing Items: Transactions are secure and handled through smart contracts, ensuring that funds are transferred only upon confirmed delivery.

<!-- USAGE EXAMPLES -->
## How to Use
**Frontend**
The frontend is built with Next.js and Tailwind CSS. It interacts with the Ethereum network using ethers.js.

* Navigating the App: The frontend supports features like viewing listed items, connecting to an Ethereum wallet, and managing purchases.
**Smart Contract**
Written in Solidity, the smart contract handles all backend logic on the blockchain.

**Functions:**
* listItem: To list a new item.
* purchaseItem: To handle the purchase transactions.

**Deploying**
* You can push your code to git using the following commands.
  ```sh
  npm run build
  Git add .
  Git commit -m “msg”
  Git push origin main
* You may host your website using Netlify or Vercel. You can link your git account to Netlify and the deployment happens automatically. When there is a new commit to the git, you may deploy it again in Netlify, it will deploy automatically.

<!--Screenshots of the Marketplace-->
![image](https://github.com/sairamp98/Blockchain_decentralized_marketplace_sepoliaeth/assets/165452102/37ddeb70-2a07-4793-9a0a-08ef992fc28a)
![image](https://github.com/sairamp98/Blockchain_decentralized_marketplace_sepoliaeth/assets/165452102/2e56084b-64ab-4b40-b0d4-2fa5eeafc2ca)
![image](https://github.com/sairamp98/Blockchain_decentralized_marketplace_sepoliaeth/assets/165452102/f7205d48-b149-4767-b1c1-eb2151f2892a)
![image](https://github.com/sairamp98/Blockchain_decentralized_marketplace_sepoliaeth/assets/165452102/b2111373-87f1-484e-823d-e2d2760f66ca)
![image](https://github.com/sairamp98/Blockchain_decentralized_marketplace_sepoliaeth/assets/165452102/e5e90b51-bda3-41e2-b532-10bca267de4d)
![image](https://github.com/sairamp98/Blockchain_decentralized_marketplace_sepoliaeth/assets/165452102/67efdcd9-8e26-4a1a-a2d4-01aa2cba4047)


<!-- CONTACT -->
## Contact
For any queries or further information, please email Your Email.

<!-- LICENSE -->
## License
This project is licensed under the MIT License - see the LICENSE.txt file for details.

<p align="right">(<a href="#top">back to top</a>)</p>

